import api from '@/api/api';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { MentalStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Thermometer, Wind, Heart, Brain, Activity } from 'lucide-react';

interface VitalEntryFormProps {
  patientId: string;
  onVitalAdded: () => void;
}

export function VitalEntryForm({ patientId, onVitalAdded }: VitalEntryFormProps) {
  const { user } = useAuth();
  const { addVital } = useData();
  const { toast } = useToast();

  const isNurse = user?.role === 'nurse';

  const [formData, setFormData] = useState({
    temperature: '',
    respiratoryRate: '',
    systolicBP: '',
    mentalStatus: '' as MentalStatus | '',
    nurseName: '',
  });
 
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    console.log("Logged User Object:", user);
    console.log("User ID being sent:", user?.id, typeof user?.id);

    if (!formData.temperature || !formData.respiratoryRate || !formData.systolicBP || !formData.mentalStatus || !formData.nurseName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all vital signs and nurse name',
        variant: 'destructive',
      });
      return;
    }
    // 🔥 Send vitals to backend database
await api.post('/vitals', {
  patient_id: Number(patientId),
  user_id: user?.id,
  nurse_name: formData.nurseName,
  temperature: parseFloat(formData.temperature),
  rr: parseInt(formData.respiratoryRate),
  sbp: parseInt(formData.systolicBP),
  mental_status: formData.mentalStatus,
});
    const vital = addVital({
      patientId,
      temperature: parseFloat(formData.temperature),
      respiratoryRate: parseInt(formData.respiratoryRate),
      systolicBP: parseInt(formData.systolicBP),
      mentalStatus: formData.mentalStatus as MentalStatus,
      nurseName: formData.nurseName,
      nurseId: user?.id || '',
    });
     
     await api.post('/audit-logs', {
  patient_id: Number(patientId),
  user_id: user?.id,
  user_name: formData.nurseName,
  role: 'nurse',
  action: 'Vitals recorded',
  details: `Temp: ${formData.temperature}°C, RR: ${formData.respiratoryRate}, SBP: ${formData.systolicBP}, Mental: ${formData.mentalStatus}, qSOFA: ${vital.qsofaScore}`
});

    toast({
      title: 'Vitals Recorded',
      description: `qSOFA Score: ${vital.qsofaScore} - ${vital.riskLevel?.toUpperCase()} risk`,
    });

    setFormData({
      temperature: '',
      respiratoryRate: '',
      systolicBP: '',
      mentalStatus: '',
      nurseName: '',
    });

    onVitalAdded();
  };

  // Only nurses can enter vitals
  if (!isNurse) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Record Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nurseName">Nurse Name</Label>
            <Input
              id="nurseName"
              value={formData.nurseName}
              onChange={(e) => setFormData({ ...formData, nurseName: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature" className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-chart-temp" />
              Temperature (°C)
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              min="30"
              max="45"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              placeholder="e.g., 37.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="respiratoryRate" className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-chart-rr" />
              Respiratory Rate (/min)
            </Label>
            <Input
              id="respiratoryRate"
              type="number"
              min="0"
              max="60"
              value={formData.respiratoryRate}
              onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
              placeholder="e.g., 18"
            />
            <p className="text-xs text-muted-foreground">qSOFA threshold: ≥22/min</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systolicBP" className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-chart-sbp" />
              Systolic BP (mmHg)
            </Label>
            <Input
              id="systolicBP"
              type="number"
              min="50"
              max="250"
              value={formData.systolicBP}
              onChange={(e) => setFormData({ ...formData, systolicBP: e.target.value })}
              placeholder="e.g., 120"
            />
            <p className="text-xs text-muted-foreground">qSOFA threshold: ≤100 mmHg</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentalStatus" className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Mental Status
            </Label>
            <Select
              value={formData.mentalStatus}
              onValueChange={(value) => setFormData({ ...formData, mentalStatus: value as MentalStatus })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mental status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="confused">Confused</SelectItem>
                <SelectItem value="drowsy">Drowsy</SelectItem>
                <SelectItem value="unresponsive">Unresponsive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">qSOFA: Any altered mental status scores 1</p>
          </div>

          <Button type="submit" className="w-full">
            <Activity className="w-4 h-4 mr-2" />
            Analyze & Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}