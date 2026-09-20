import api from '@/api/api';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AcknowledgmentFlag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCheck, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface AcknowledgmentFormProps {
  patientId: string;
  latestVitalId: string;
}

export function AcknowledgmentForm({ patientId, latestVitalId }: AcknowledgmentFormProps) {
  const { user } = useAuth();
  const { addAcknowledgment } = useData();
  const { toast } = useToast();

  const [notes, setNotes] = useState('');
  const [flag, setFlag] = useState<AcknowledgmentFlag>('reviewed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user?.role !== 'doctor') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsSubmitting(true);

    addAcknowledgment({
      patientId,
      vitalReadingId: latestVitalId,
      doctorId: user.id,
      doctorName: user.name || user.email,
      notes,
      flag,
    });
    await api.post('/audit-logs', {
  patient_id: patientId,
  user_id: user.id,
  user_name: user.name || user.email,
  role: 'doctor',
  action: 'Doctor acknowledged vitals',
  details: `Flag: ${flag}. Notes: ${notes || 'No notes added'}`,
});

    toast({
      title: 'Acknowledged',
      description: 'Your review has been recorded',
    });

    setNotes('');
    setFlag('reviewed');
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          Doctor Acknowledgment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Status Flag</Label>
            <RadioGroup
              value={flag}
              onValueChange={(value) => setFlag(value as AcknowledgmentFlag)}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="reviewed" id="reviewed" />
                <Label htmlFor="reviewed" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Reviewed
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="needs-followup" id="needs-followup" />
                <Label htmlFor="needs-followup" className="flex items-center gap-2 cursor-pointer flex-1">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Needs Follow-up
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="critical" id="critical" />
                <Label htmlFor="critical" className="flex items-center gap-2 cursor-pointer flex-1">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Critical
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your clinical observations and recommendations..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Submit Acknowledgment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
