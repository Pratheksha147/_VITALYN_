import { Activity, Shield, TrendingUp, Users, ArrowRight, Clock, Stethoscope, HeartPulse, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: Clock, title: 'Real-time Monitoring', description: 'Track vitals around the clock with instant alerts' },
  { icon: ClipboardList, title: 'Patient Records', description: 'Secure and organized patient information' },
  { icon: Stethoscope, title: 'Risk Assessment', description: 'qSOFA-based sepsis detection system' },
  { icon: HeartPulse, title: 'Vital Tracking', description: 'Monitor all vital signs in one place' },
];

const services = [
  { name: 'Vitals', position: 'top-1/4 left-0' },
  { name: 'qSOFA', position: 'top-1/2 -left-4' },
  { name: 'Alerts', position: 'bottom-1/4 left-0' },
  { name: 'Reports', position: 'top-1/3 right-0' },
  { name: 'Analysis', position: 'bottom-1/3 right-0' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-primary">Vitalyn</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
          </nav>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-primary hover:bg-primary/90 rounded-full px-6"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section with curved background */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Curved background shape */}
          <div className="absolute inset-0 -z-10">
            <svg className="absolute w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="hsl(var(--info))" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path 
                d="M0,0 L1440,0 L1440,600 Q1200,700 720,650 Q240,600 0,700 Z" 
                fill="url(#heroGradient)"
              />
            </svg>
            {/* Decorative circles */}
            <div className="absolute top-32 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-info/5 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
              {/* Left content */}
              <div className="animate-fade-in">
                <span className="inline-block text-sm font-medium text-primary uppercase tracking-wider mb-4">
                  Healthcare Monitoring
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Early Sepsis
                  <br />
                  <span className="text-primary">Detection System</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  Monitor patient vitals in real-time, calculate qSOFA scores, and detect sepsis risk early with our intelligent monitoring platform.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')} 
                  className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-base gap-2 shadow-lg shadow-primary/25"
                >
                  Start Monitoring <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Right side - decorative element with floating badges */}
              <div className="relative hidden lg:flex justify-center items-center">
                {/* Main decorative blob */}
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-info/15 to-primary/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[blob_8s_ease-in-out_infinite]" />
                  <div className="absolute inset-4 bg-gradient-to-tr from-primary/30 via-info/20 to-transparent rounded-[40%_60%_70%_30%/40%_70%_30%_60%] animate-[blob_10s_ease-in-out_infinite_reverse]" />
                  
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                      <Stethoscope className="w-12 h-12 text-primary" />
                    </div>
                  </div>

                  {/* Floating service badges */}
                  {services.map((service, index) => (
                    <div
                      key={service.name}
                      className={`absolute ${service.position} transform -translate-x-1/2`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce whitespace-nowrap"
                        style={{ animationDuration: `${3 + index * 0.5}s` }}
                      >
                        {service.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="py-8 -mt-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="group bg-card border-border/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 relative overflow-hidden">
          {/* Background decorative shape */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 -z-10">
            <svg className="h-full w-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
              <ellipse cx="400" cy="400" rx="350" ry="350" fill="hsl(var(--primary))" fillOpacity="0.08" />
              <ellipse cx="450" cy="350" rx="250" ry="250" fill="hsl(var(--info))" fillOpacity="0.06" />
            </svg>
          </div>

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left side - illustration area */}
              <div className="relative flex justify-center">
                <div className="relative">
                  {/* Blob background */}
                  <div className="w-72 h-80 bg-gradient-to-br from-primary/20 to-info/10 rounded-[60%_40%_55%_45%/55%_45%_55%_45%]" />
                  
                  {/* Floating service pills */}
                  <div className="absolute top-8 -left-8 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                    <Activity className="w-4 h-4 inline mr-2" />
                    Vital Signs
                  </div>
                  <div className="absolute top-1/3 -left-12 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                    <HeartPulse className="w-4 h-4 inline mr-2" />
                    Cardiology
                  </div>
                  <div className="absolute bottom-1/3 -left-8 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Analytics
                  </div>
                  <div className="absolute top-1/4 -right-8 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }}>
                    <Shield className="w-4 h-4 inline mr-2" />
                    Security
                  </div>
                  <div className="absolute bottom-1/4 -right-12 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
                    <Users className="w-4 h-4 inline mr-2" />
                    Team
                  </div>
                </div>
              </div>

              {/* Right side - content */}
              <div>
                <span className="inline-block text-sm font-medium text-primary uppercase tracking-wider mb-4">
                  Our Services
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Complete Sepsis Monitoring Solution
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Vitalyn provides a comprehensive suite of tools for healthcare professionals to monitor, analyze, and respond to patient vital signs with precision and speed.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Real-time vital sign monitoring and alerts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">qSOFA score calculation with risk analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Secure role-based access for medical teams</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-primary hover:bg-primary/90 rounded-full px-8"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 via-info/5 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Continuous Monitoring</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-bold text-primary">qSOFA</p>
                <p className="text-sm text-muted-foreground">Risk Scoring</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-bold text-primary">Fast</p>
                <p className="text-sm text-muted-foreground">Early Detection</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="about" className="py-24">
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl bg-gradient-to-r from-primary to-info p-12 md:p-16 text-center overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-8 left-8 w-20 h-20 border-2 border-white/20 rounded-full" />
              <div className="absolute bottom-8 right-8 w-32 h-32 border-2 border-white/20 rounded-full" />
              <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-white/20 rounded-full" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to improve patient outcomes?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Join healthcare professionals using Vitalyn for early sepsis detection and better patient care.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-base shadow-xl"
                >
                  Get Started Today <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Vitalyn. Built for better patient outcomes.
        </div>
      </footer>
    </div>
  );
}
