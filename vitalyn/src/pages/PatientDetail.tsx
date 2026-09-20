import api from "../api/api";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

import { AppLayout } from '@/components/layout/AppLayout';
import { VitalEntryForm } from '@/components/vitals/VitalEntryForm';
import { VitalsChart } from '@/components/vitals/VitalsChart';
import { AnalysisResult } from '@/components/vitals/AnalysisResult';
import { AuditLogPanel } from '@/components/vitals/AuditLogPanel';
import { AcknowledgmentForm } from '@/components/doctor/AcknowledgmentForm';
import { RiskBadge } from '@/components/patients/RiskBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Bed, Building2, Activity, History, ClipboardList, FileText, Download } from 'lucide-react';
import { useState,useEffect } from 'react';
import { format, subDays, isAfter } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
 


  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('vitals');
  const [filters, setFilters] = useState({ last24h: false, yesterday: false, last7d: true });
  const [patient, setPatient] = useState<any>(null);
  const [vitals, setVitals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
  if (!id) return;

  // fetch patient
  api.get(`/patients/${id}`)
    .then(res => setPatient(res.data))
    .catch(() => setPatient(null));

  // fetch vitals
  // fetch vitals from DataContext ✅
api.get(`/vitals/${id}`)
  .then(res => {
    const mapped = res.data.map((v: any) => ({
      id: v.id,
      patientId: v.patientId,
      temperature: v.temperature, 
      respiratoryRate: v.respiratoryRate,
      systolicBP: v.systolicBP,
      mentalStatus: v.mentalStatus,
      qsofaScore:
  (v.respiratoryRate >= 22 ? 1 : 0) +
  (v.systolicBP <= 100 ? 1 : 0) +
  (v.mentalStatus !== 'alert' ? 1 : 0),

riskLevel:
  ((v.respiratoryRate >= 22 ? 1 : 0) +
   (v.systolicBP <= 100 ? 1 : 0) +
   (v.mentalStatus !== 'alert' ? 1 : 0)) >= 2
    ? 'high'
    : 'moderate',
      timestamp: v.timestamp,
      nurseName: v.nurseName,
    }));
    console.log("Vitals received:", mapped);
    setVitals(mapped);
  })
  .catch(() => setVitals([]));


  // fetch alerts / logs (optional)
api.get(`/audit-logs/${id}`)
  .then(res => setLogs(res.data))
  .catch(() => setLogs([]));


}, [id, refreshKey]);


  const latestVital =
  vitals.length > 0
    ? [...vitals]
        .filter(v => v.timestamp)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        )[0]
    : null;



  const isNurse = user?.role === 'nurse';
  const isDoctor = user?.role === 'doctor';

  // Filter vitals for timeline
  const filteredVitals = vitals.filter(v => {
    const vDate = new Date(v.timestamp);
    const now = new Date();
    if (filters.last24h && isAfter(vDate, subDays(now, 1))) return true;
    if (filters.yesterday && isAfter(vDate, subDays(now, 2)) && !isAfter(vDate, subDays(now, 1))) return true;
    if (filters.last7d && isAfter(vDate, subDays(now, 7))) return true;
    return !filters.last24h && !filters.yesterday && !filters.last7d;
  });

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('VITALYN - PATIENT REPORT', pageWidth / 2, 20, { align: 'center' });
    
    // Generated date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, pageWidth / 2, 28, { align: 'center' });
    
    // Patient Information Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 14, 42);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const patientInfo = [
      `Name: ${patient?.name}`,
      `Age: ${patient?.age} years`,
      `Ward: ${patient?.wardName}`,
      `Bed: ${patient?.bedNumber}`,
      `Current Risk Level: ${patient?.riskLevel?.toUpperCase() || 'Not assessed'}`,
    ];
    patientInfo.forEach((line, i) => {
      doc.text(line, 14, 50 + (i * 6));
    });
    
    // Latest Vital Signs Section
    let yPos = 82;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Latest Vital Signs', 14, yPos);
    
    if (latestVital) {
      autoTable(doc, {
        startY: yPos + 4,
        head: [['Parameter', 'Value']],
        body: [
          ['Time', latestVital?.timestamp
  ? format(new Date(latestVital.timestamp), 'PPpp')
  : 'No timestamp'
],
          ['Temperature', `${latestVital?.temperature ?? ''}°C`],
          ['Respiratory Rate', `${latestVital.respiratoryRate}/min`],
          ['Systolic BP', `${latestVital.systolicBP} mmHg`],
          ['Mental Status', latestVital.mentalStatus],
          ['qSOFA Score', `${latestVital.qsofaScore}/3`],
          ['Recorded by', latestVital.nurseName],
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10 },
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('No vitals recorded', 14, yPos + 8);
      yPos += 16;
    }
    
    // Vital Signs History Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Vital Signs History (Last 7 Days)', 14, yPos);
    
    if (filteredVitals.length > 0) {
      autoTable(doc, {
        startY: yPos + 4,
        head: [['Date & Time', 'Temp (°C)', 'RR (/min)', 'SBP (mmHg)', 'Mental Status', 'qSOFA']],
        body: filteredVitals.map(v => [
  v.timestamp ? format(new Date(v.timestamp), 'PPp') : 'No timestamp',
  String(v.temperature),
  String(v.respiratoryRate),
  String(v.systolicBP),
  v.mentalStatus,
  `${v.qsofaScore}/3`,
]),
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219], textColor: 255 },
        styles: { fontSize: 9 },
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('No readings in the selected period', 14, yPos + 8);
      yPos += 16;
    }
    
    // Check if we need a new page for audit log
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    // Audit Log Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Audit Log', 14, yPos);
    
    if (logs.length > 0) {
      autoTable(doc, {
        startY: yPos + 4,
        head: [['Date & Time', 'User', 'Action', 'Details']],
        body: logs.slice(0, 20).map(l => [
         format(new Date(l.created_at), 'PPp'),
          l.user_name,
          l.action,
          l.details.length > 60 ? l.details.substring(0, 60) + '...' : l.details,
        ]),
        theme: 'striped',
        headStyles: { fillColor: [155, 89, 182], textColor: 255 },
        styles: { fontSize: 8 },
        columnStyles: {
          3: { cellWidth: 60 },
        },
      });
    } else {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('No activity recorded', 14, yPos + 8);
    }
    
    // Save the PDF
    doc.save(`patient-report-${patient?.name?.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  if (!patient) {
    return <AppLayout><div className="text-center py-12">Patient not found</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <RiskBadge level={latestVital?.riskLevel || patient.riskLevel} size="md" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{patient.age} years</span>
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />Ward {patient.wardName}</span>
              <span className="flex items-center gap-1"><Bed className="w-4 h-4" />Bed {patient.bedNumber}</span>
            </div>
          </div>
          <Button variant="outline" onClick={handleGeneratePDF} className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Patient Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="vitals" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Audit Logs</span>
            </TabsTrigger>
          </TabsList>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="mt-6">
  <div className="space-y-6">

    {isNurse && (
      <VitalEntryForm
        patientId={id!}
        onVitalAdded={() => setRefreshKey(k => k + 1)}
      />
    )}

    {latestVital && (
      <Card>
        <CardHeader>
          <CardTitle>Latest Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalysisResult vital={latestVital} />
        </CardContent>
      </Card>
    )}

    <Card>
      <CardHeader>
        <CardTitle>Vital Signs Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <VitalsChart vitals={vitals} />
      </CardContent>
    </Card>

  </div>
</TabsContent>



          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Timeline & Replay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {[
                      { key: 'last24h', label: 'Last 24 Hours' }, 
                      { key: 'yesterday', label: 'Yesterday' }, 
                      { key: 'last7d', label: 'Last 7 Days' }
                    ].map(f => (
                      <div key={f.key} className="flex items-center gap-2">
                        <Checkbox 
                          id={f.key} 
                          checked={filters[f.key as keyof typeof filters]} 
                          onCheckedChange={(c) => setFilters({ ...filters, [f.key]: c })} 
                        />
                        <Label htmlFor={f.key}>{f.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <VitalsChart vitals={filteredVitals} />

              <Card>
                <CardHeader>
                  <CardTitle>Reading History ({filteredVitals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredVitals.map(v => (
                      <div key={v.id} className="p-3 rounded-lg bg-muted/30 grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Time:</span>{format(new Date(v.timestamp.replace(' GMT','')), 'dd MMM yyyy, hh:mm a')}</div>
                        <div><span className="text-muted-foreground">Temp:</span> {v.temperature}°C</div>
                        <div><span className="text-muted-foreground">RR:</span> {v.respiratoryRate}/min</div>
                        <div><span className="text-muted-foreground">SBP:</span> {v.systolicBP} mmHg</div>
                        <div><span className="text-muted-foreground">qSOFA:</span> {v.qsofaScore}/3</div>
                        <div><span className="text-muted-foreground">Nurse:</span> {v.nurseName}</div>
                      </div>
                    ))}
                    {filteredVitals.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No readings match the selected filters</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="mt-6">
            <AuditLogPanel logs={logs} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}