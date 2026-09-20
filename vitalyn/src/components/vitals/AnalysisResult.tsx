import { VitalReading } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskBadge } from '@/components/patients/RiskBadge';
import { Thermometer, Wind, Heart, Brain, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AnalysisResultProps {
  vital: VitalReading;
}

export function AnalysisResult({ vital }: AnalysisResultProps) {
  const rrFlag = vital.respiratoryRate >= 22;
const sbpFlag = vital.systolicBP <= 100;
const mentalFlag = vital.mentalStatus !== 'alert';

  const getExplanation = () => {
    const points: string[] = [];
    
    if (vital.respiratoryRate >= 22) {
      points.push(`Respiratory rate (${vital.respiratoryRate}/min) is elevated (≥22)`);
    }
    if (vital.systolicBP <= 100) {
      points.push(`Systolic BP (${vital.systolicBP} mmHg) is low (≤100)`);
    }
    if (vital.mentalStatus !== 'alert') {
      points.push(`Mental status is altered (${vital.mentalStatus})`);
    }
    
    if (points.length === 0) {
      return 'All vital signs are within normal qSOFA thresholds.';
    }
    
    return points.join('. ') + '.';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Latest Analysis</CardTitle>
          <RiskBadge level={vital.riskLevel} size="md" />
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), 'PPpp')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Thermometer className="w-5 h-5 text-chart-temp" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="font-semibold">{vital.temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Wind className="w-5 h-5 text-chart-rr" />
            <div>
              <p className="text-xs text-muted-foreground">Respiratory Rate</p>
              <p className="font-semibold">{vital.respiratoryRate}/min</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Heart className="w-5 h-5 text-chart-sbp" />
            <div>
              <p className="text-xs text-muted-foreground">Systolic BP</p>
              <p className="font-semibold">{vital.systolicBP} mmHg</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Mental Status</p>
              <p className="font-semibold capitalize">{vital.mentalStatus}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-accent/50 border border-accent">
        <div className="rounded-lg border bg-muted/30 p-4">
  <h4 className="font-semibold mb-2">qSOFA Factor Breakdown</h4>

  <ul className="space-y-1 text-sm">
    <li className={rrFlag ? "text-red-600" : "text-green-600"}>
      {rrFlag ? "✔" : "✖"} Respiratory Rate ≥ 22 /min
    </li>

    <li className={sbpFlag ? "text-red-600" : "text-green-600"}>
      {sbpFlag ? "✔" : "✖"} Systolic BP ≤ 100 mmHg
    </li>

    <li className={mentalFlag ? "text-red-600" : "text-green-600"}>
      {mentalFlag ? "✔" : "✖"} Altered Mental Status
    </li>
  </ul>
</div>

          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5" />
            <div>
              <p className="font-medium text-accent-foreground">
                qSOFA Score: {vital.qsofaScore}/3
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {getExplanation()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

