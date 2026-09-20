import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '', 
    role: '' as UserRole | '',
    identifier: '' // doctor name or ward name
  });
  
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: '' as UserRole | '',
    name: '', // for doctors
    wardName: '' // for nurses
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.role) {
      toast({ title: 'Please select a role', variant: 'destructive' });
      return;
    }
    if (!loginData.identifier.trim()) {
      const fieldName = loginData.role === 'doctor' ? 'name' : 'ward name';
      toast({ title: `Please enter your ${fieldName}`, variant: 'destructive' });
      return;
    }
    
    const success = await login(loginData.email, loginData.password, loginData.role, loginData.identifier.trim());
    if (success) {
      toast({ title: 'Welcome back!' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Login failed', description: 'Invalid credentials or role mismatch', variant: 'destructive' });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (!signupData.role) {
      toast({ title: 'Please select a role', variant: 'destructive' });
      return;
    }
    if (signupData.role === 'nurse' && !signupData.wardName.trim()) {
      toast({ title: 'Please enter your ward name', variant: 'destructive' });
      return;
    }
    if (signupData.role === 'doctor' && !signupData.name.trim()) {
      toast({ title: 'Please enter your name', variant: 'destructive' });
      return;
    }
    
    const success = await signup(
      signupData.email, 
      signupData.password, 
      signupData.role,
      signupData.role === 'doctor' ? signupData.name.trim() : undefined,
      signupData.role === 'nurse' ? signupData.wardName.trim() : undefined
    );
    
    if (success) {
      toast({ title: 'Account created!' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Account already exists', description: 'This email and role combination is already registered', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle>Vitalyn</CardTitle>
          <CardDescription>Sepsis Monitoring System</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Hospital Email</Label>
                  <Input 
                    type="email" 
                    value={loginData.email} 
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input 
                    type="password" 
                    value={loginData.password} 
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={loginData.role} 
                    onValueChange={(v) => setLoginData({ ...loginData, role: v as UserRole, identifier: '' })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {loginData.role === 'doctor' && (
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input 
                      value={loginData.identifier} 
                      onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })} 
                      placeholder="Enter your registered name"
                      required
                    />
                  </div>
                )}
                {loginData.role === 'nurse' && (
                  <div className="space-y-2">
                    <Label>Ward Name</Label>
                    <Input 
                      value={loginData.identifier} 
                      onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })} 
                      placeholder="e.g., A-12, ICU-3, Ward-B5"
                      required
                    />
                  </div>
                )}
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label>Hospital Email</Label>
                  <Input 
                    type="email" 
                    value={signupData.email} 
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={signupData.role} 
                    onValueChange={(v) => setSignupData({ ...signupData, role: v as UserRole, name: '', wardName: '' })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {signupData.role === 'doctor' && (
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input 
                      value={signupData.name} 
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} 
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}
                {signupData.role === 'nurse' && (
                  <div className="space-y-2">
                    <Label>Ward Name</Label>
                    <Input 
                      value={signupData.wardName} 
                      onChange={(e) => setSignupData({ ...signupData, wardName: e.target.value })} 
                      placeholder="e.g., A-12, ICU-3, Ward-B5"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Enter your assigned ward (letters, numbers, and hyphens allowed)</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input 
                    type="password" 
                    value={signupData.password} 
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input 
                    type="password" 
                    value={signupData.confirmPassword} 
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
