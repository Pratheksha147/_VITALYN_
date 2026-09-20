
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from "@/api/api";
import { useEffect, useState } from "react";

import { AppLayout } from '@/components/layout/AppLayout';
import { PatientCard } from '@/components/patients/PatientCard';
import { PatientTable } from '@/components/patients/PatientTable';
import { AddPatientDialog } from '@/components/patients/AddPatientDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plus, LayoutGrid, List, Search, Building2, Users, ArrowLeft } from 'lucide-react';
import { RiskBadge } from '@/components/patients/RiskBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const fetchPatients = () => {
  api.get("/patients")
    .then(res => setPatients(res.data))
    .catch(() => setPatients([]));
};

useEffect(() => {
  fetchPatients();
}, []);


  const isDoctor = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse';

  // For nurses: show only patients from their ward
  // For doctors: show ward list first, then drill down
  const getDisplayPatients = () => {
  if (isNurse && user?.wardName) {
    return patients.filter(p => p.wardName === user.wardName);
  }
  if (isDoctor && selectedWard) {
    return patients.filter(p => p.wardName === selectedWard);
  }
  return [];
};

  const displayPatients = getDisplayPatients();
  const filteredPatients = displayPatients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.bedNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const allWards = [...new Set(patients.map(p => p.wardName))];

  const filteredWards = allWards.filter(w =>
    w.toLowerCase().includes(search.toLowerCase())
  );

  // Doctor ward list view
  if (isDoctor && !selectedWard) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">All Wards</h1>
              <p className="text-muted-foreground">Select a ward to view patients</p>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search wards..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9" 
            />
          </div>

          {filteredWards.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWards.map(ward => {
                const wardPatients = patients.filter(
  p => p.wardName === ward
);

                const highRiskCount = wardPatients.filter(p => p.riskLevel === 'high').length;
                const moderateRiskCount = wardPatients.filter(p => p.riskLevel === 'moderate').length;
                
                return (
                  <Card 
                    key={ward} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedWard(ward)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        {ward}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{wardPatients.length} patients</span>
                        </div>
                        <div className="flex gap-1">
                          {highRiskCount > 0 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-risk-high/10 text-risk-high font-medium">
                              {highRiskCount} high
                            </span>
                          )}
                          {moderateRiskCount > 0 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-risk-moderate/10 text-risk-moderate font-medium">
                              {moderateRiskCount} mod
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {allWards.length === 0 
                ? "No wards found. Patients will appear here once nurses add them."
                : "No wards match your search."
              }
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isDoctor && selectedWard && (
              <Button variant="ghost" size="icon" onClick={() => setSelectedWard(null)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {isNurse ? `Ward ${user?.wardName}` : `Ward ${selectedWard}`}
              </h1>
              <p className="text-muted-foreground">
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {isNurse && (
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Patient
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or bed number..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9" 
            />
          </div>
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as 'grid' | 'table')}>
            <ToggleGroupItem value="grid"><LayoutGrid className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="table"><List className="w-4 h-4" /></ToggleGroupItem>
          </ToggleGroup>
        </div>

        {view === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPatients.map(p => (
              <PatientCard key={p.id} patient={p} onClick={() => navigate(`/patients/${p.id}`)} />
            ))}
            {filteredPatients.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {displayPatients.length === 0 
                  ? isNurse 
                    ? 'No patients in your ward. Click "Add Patient" to get started.'
                    : 'No patients in this ward.'
                  : 'No patients match your search.'
                }
              </div>
            )}
          </div>
        ) : (
          <PatientTable patients={filteredPatients} onPatientClick={(p) => navigate(`/patients/${p.id}`)} />
        )}
      </div>
      {isNurse && (
  <AddPatientDialog
    open={showAddDialog}
    onOpenChange={setShowAddDialog}
    onPatientAdded={fetchPatients}
  />
)}

    </AppLayout>
  );
  
}

