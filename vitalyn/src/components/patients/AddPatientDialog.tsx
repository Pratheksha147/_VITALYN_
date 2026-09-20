import api from "@/api/api";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientAdded: () => void;
}

export function AddPatientDialog({
  open,
  onOpenChange,
  onPatientAdded,
}: AddPatientDialogProps) {

  const { user } = useAuth();
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
  nurseName: '',
  patientName: '',
  age: '',
  bedNumber: '',
  wardName: '',     // 🔥 ADD THIS
});
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("🔥 handleSubmit triggered");


  if (!formData.patientName || !formData.age || !formData.bedNumber || !formData.nurseName) {
    toast({
      title: "Missing Information",
      description: "Please fill in all fields",
      variant: "destructive",
    });
    return;
  }

  

  try {
   const res = await api.post("/patients", {
  name: formData.patientName,
  age: Number(formData.age),
  bedNumber: formData.bedNumber,
  wardName: formData.wardName,
  nurseName: formData.nurseName
});


 


   toast({
  title: "Patient Added",
  description: `Patient added with ID ${res.data.patient_id}`,
});

onPatientAdded();   // ⭐ THIS IS THE KEY LINE

setFormData({
  nurseName: "",
  patientName: "",
  age: "",
  bedNumber: "",
  wardName: "",     // 🔥 ADD THIS
});

onOpenChange(false);

  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to add patient",
      variant: "destructive",
    });
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
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
  <Label htmlFor="wardName">Ward Name</Label>
  <Input
    id="wardName"
    value={formData.wardName}
    onChange={(e) =>
      setFormData({ ...formData, wardName: e.target.value })
    }
    placeholder="e.g. Z-16, ICU-2"
  />
</div>
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="Enter patient name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="150"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedNumber">Bed Number</Label>
              <Input
                id="bedNumber"
                value={formData.bedNumber}
                onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                placeholder="e.g., 1, 2A, B-5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 

