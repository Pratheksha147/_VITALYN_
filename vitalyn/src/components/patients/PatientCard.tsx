import { User, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Patient } from '@/types';
import { RiskBadge } from './RiskBadge';
import { formatDistanceToNow } from 'date-fns';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const lastReadingTime = patient.lastReading 
    ? formatDistanceToNow(new Date(patient.lastReading.timestamp), { addSuffix: true })
    : 'No readings yet';

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/30 animate-fade-in"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">{patient.age} years old</p>
            </div>
          </div>
          <RiskBadge level={patient.riskLevel} showLabel={false} size="sm" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Bed {patient.bedNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{lastReadingTime}</span>
          </div>
        </div>

        {patient.lastReading && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-muted-foreground">Temp</p>
                <p className="font-medium">{patient.lastReading.temperature}°C</p>
              </div>
              <div>
                <p className="text-muted-foreground">RR</p>
                <p className="font-medium">{patient.lastReading.respiratoryRate}/min</p>
              </div>
              <div>
                <p className="text-muted-foreground">SBP</p>
                <p className="font-medium">{patient.lastReading.systolicBP} mmHg</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
