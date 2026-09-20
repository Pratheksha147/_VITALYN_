export type UserRole = 'nurse' | 'doctor';

export interface User {
  id: string;
  email: string;
  name?: string; // Doctor's name
  role: UserRole;
  wardName?: string; // Only for nurses, format like "A-12"
  createdAt: string;
}

export type MentalStatus = 'alert' | 'confused' | 'drowsy' | 'unresponsive';

export interface VitalReading {
  id: string;
  patientId: string;
  temperature: number;
  respiratoryRate: number;
  systolicBP: number;
  mentalStatus: MentalStatus;
  nurseName: string;
  nurseId: string;
  timestamp: string;
  qsofaScore?: number;
  riskLevel?: RiskLevel;
}

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface Patient {
  id: string;
  name: string;
  age: number;
  wardName: string; // Ward the patient belongs to
  bedNumber: string; // Bed number within the ward
  nurseName: string;
  nurseId: string;
  createdAt: string;
  lastReading?: VitalReading;
  riskLevel?: RiskLevel;
}

export type AcknowledgmentFlag = 'reviewed' | 'needs-followup' | 'critical';

export interface Acknowledgment {
  id: string;
  patientId: string;
  vitalReadingId: string;
  doctorId: string;
  doctorName: string;
  notes: string;
  flag: AcknowledgmentFlag;
  timestamp: string;
}

export interface AuditLog {
  id: number
  patient_id: number
  user_id: string
  user_name: string
  role: string
  action: string
  details: string
  created_at: string
}
