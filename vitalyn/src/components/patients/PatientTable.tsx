import { formatDistanceToNow } from 'date-fns';
import { Patient } from '@/types';
import { RiskBadge } from './RiskBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface PatientTableProps {
  patients: Patient[];
  onPatientClick: (patient: Patient) => void;
}

export function PatientTable({ patients, onPatientClick }: PatientTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Patient</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Bed</TableHead>
            <TableHead>Last Reading</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.id} 
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onPatientClick(patient)}
            >
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>Bed {patient.bedNumber}</TableCell>
              <TableCell>
                {patient.lastReading 
                  ? formatDistanceToNow(new Date(patient.lastReading.timestamp), { addSuffix: true })
                  : 'No readings'
                }
              </TableCell>
              <TableCell>
                <RiskBadge level={patient.riskLevel} size="sm" />
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPatientClick(patient);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {patients.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No patients found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
