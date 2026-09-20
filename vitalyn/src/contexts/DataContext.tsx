import api from '@/api/api';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, VitalReading, Acknowledgment, AuditLog, RiskLevel, MentalStatus } from '@/types';
import { useAuth } from './AuthContext';

interface DataContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Patient;
  getPatient: (id: string) => Patient | undefined;
  getPatientsByWard: (wardName: string) => Patient[];
  getAllWards: () => string[];
  
  vitals: VitalReading[];
  addVital: (vital: Omit<VitalReading, 'id' | 'timestamp' | 'qsofaScore' | 'riskLevel'>) => VitalReading;
  getPatientVitals: (patientId: string) => Promise<VitalReading[]>;
  
  acknowledgments: Acknowledgment[];
  addAcknowledgment: (ack: Omit<Acknowledgment, 'id' | 'timestamp'>) => Acknowledgment;
  getPatientAcknowledgments: (patientId: string) => Acknowledgment[];
  
  auditLogs: AuditLog[];
  getPatientAuditLogs: (patientId: string) => AuditLog[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const PATIENTS_KEY = 'vitalyn_patients_v2';
const VITALS_KEY = 'vitalyn_vitals_v2';
const ACKNOWLEDGMENTS_KEY = 'vitalyn_acknowledgments_v2';
const AUDIT_LOGS_KEY = 'vitalyn_audit_logs_v2';

// Clear old data from previous schema version
const OLD_KEYS = ['vitalyn_patients', 'vitalyn_vitals', 'vitalyn_acknowledgments', 'vitalyn_audit_logs'];
OLD_KEYS.forEach(key => localStorage.removeItem(key));

// qSOFA calculation
function calculateQSOFA(rr: number, sbp: number, mentalStatus: MentalStatus): number {
  let score = 0;
  if (rr >= 22) score++;
  if (sbp <= 100) score++;
  if (mentalStatus !== 'alert') score++;
  return score;
}

function getRiskLevel(qsofaScore: number): RiskLevel {
  if (qsofaScore === 0) return 'low';
  if (qsofaScore === 1) return 'moderate';
  return 'high';
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vitals, setVitals] = useState<VitalReading[]>([]);
  const [acknowledgments, setAcknowledgments] = useState<Acknowledgment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load from localStorage
  useEffect(() => {
    setPatients(JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]'));
    setAcknowledgments(JSON.parse(localStorage.getItem(ACKNOWLEDGMENTS_KEY) || '[]'));
    setAuditLogs(JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]'));
  }, []);

  const addAuditLog = (patientId: string, action: string, details: string, userName?: string) => {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      patientId,
      userId: user?.id || '',
      userName: userName || user?.email || 'Unknown',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    const updated = [...auditLogs, log];
    setAuditLogs(updated);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>): Patient => {
    const patient: Patient = {
      ...patientData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...patients, patient];
    setPatients(updated);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
    addAuditLog(patient.id, 'PATIENT_CREATED', `Patient ${patient.name} created in Ward ${patient.wardName}, Bed ${patient.bedNumber}`, patient.nurseName);
    return patient;
  };

  const getPatient = (id: string) => patients.find(p => p.id === id);

  const getPatientsByWard = (wardName: string) => 
    patients.filter(p => p.wardName.toLowerCase() === wardName.toLowerCase());

  const getAllWards = () => {
    const wards = [...new Set(patients.map(p => p.wardName))];
    return wards.sort();
  };

  const addVital = (vitalData: Omit<VitalReading, 'id' | 'timestamp' | 'qsofaScore' | 'riskLevel'>): VitalReading => {
    const qsofaScore = calculateQSOFA(vitalData.respiratoryRate, vitalData.systolicBP, vitalData.mentalStatus);
    const riskLevel = getRiskLevel(qsofaScore);
    
    const vital: VitalReading = {
      ...vitalData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      qsofaScore,
      riskLevel,
    };
    
    const updatedVitals = [...vitals, vital];
    setVitals(updatedVitals);
    

    // Update patient's last reading and risk level
    const updatedPatients = patients.map(p => 
      p.id === vital.patientId 
        ? { ...p, lastReading: vital, riskLevel }
        : p
    );
    setPatients(updatedPatients);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients));

    addAuditLog(vital.patientId, 'VITAL_RECORDED', 
      `Vitals recorded - Temp: ${vital.temperature}°C, RR: ${vital.respiratoryRate}, SBP: ${vital.systolicBP}, Mental: ${vital.mentalStatus}, qSOFA: ${qsofaScore}`,
      vital.nurseName
    );
    
    return vital;
  };

  const getPatientVitals = async (patientId: string) => {
  const res = await api.get(`/vitals/${patientId}`);
  return res.data;
 };

  const addAcknowledgment = (ackData: Omit<Acknowledgment, 'id' | 'timestamp'>): Acknowledgment => {
    const ack: Acknowledgment = {
      ...ackData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...acknowledgments, ack];
    setAcknowledgments(updated);
    localStorage.setItem(ACKNOWLEDGMENTS_KEY, JSON.stringify(updated));
    addAuditLog(ack.patientId, 'DOCTOR_ACKNOWLEDGED', 
      `Dr. ${ack.doctorName} acknowledged with flag: ${ack.flag}. Notes: ${ack.notes}`,
      ack.doctorName
    );
    return ack;
  };

  const getPatientAcknowledgments = (patientId: string) =>
    acknowledgments.filter(a => a.patientId === patientId).sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const getPatientAuditLogs = (patientId: string) =>
  auditLogs
    .filter(l => l.patientId === patientId)
    .sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );



  return (
    <DataContext.Provider value={{
      patients,
      addPatient,
      getPatient,
      getPatientsByWard,
      getAllWards,
      vitals,
      addVital,
      getPatientVitals,
      acknowledgments,
      addAcknowledgment,
      getPatientAcknowledgments,
      auditLogs,
      getPatientAuditLogs,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
