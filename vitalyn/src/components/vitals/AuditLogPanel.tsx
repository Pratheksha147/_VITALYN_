import { AuditLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { History, User, Activity, FileCheck } from 'lucide-react';

interface AuditLogPanelProps {
  logs: AuditLog[];
}

const getActionIcon = (action: string) => {
  if (action.includes('VITAL')) return Activity;
  if (action.includes('DOCTOR') || action.includes('ACKNOWLEDGED')) return FileCheck;
  if (action.includes('PATIENT')) return User;
  return History;
};

const getActionColor = (action: string) => {
  if (action.includes('VITAL')) return 'text-chart-rr';
  if (action.includes('DOCTOR') || action.includes('ACKNOWLEDGED')) return 'text-primary';
  if (action.includes('PATIENT')) return 'text-info';
  return 'text-muted-foreground';
};

export function AuditLogPanel({ logs }: AuditLogPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5 text-primary" />
          Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-4 pb-4 space-y-3">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No activity recorded yet
              </p>
            ) : (
              logs.map((log) => {
                const Icon = getActionIcon(log.action);
                const color = getActionColor(log.action);
                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{log.user_name}</p>


                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(log.created_at), 'HH:mm')}

                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM dd, yyyy')}


                        </p>
                        <p className="text-sm mt-1 text-foreground/80">{log.details}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
