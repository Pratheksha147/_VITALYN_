import { VitalReading } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';

interface VitalsChartProps {
  vitals: VitalReading[];
}

export function VitalsChart({ vitals }: VitalsChartProps) {
  const chartData = [...vitals]
  .filter(v => v.timestamp)
  .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
 .map((v) => ({
  dateTime: format(new Date(Date.parse(v.timestamp)), 'HH:mm:ss'),

    // Backend does not store temperature yet
    temperature: v.temperature ?? 37,

    respiratoryRate: v.respiratoryRate,
    systolicBP: v.systolicBP,

    // Calculate qSOFA dynamically since backend doesn't send it
    qsofaScore:
      (v.respiratoryRate >= 22 ? 1 : 0) +
      (v.systolicBP <= 100 ? 1 : 0) +
      (v.mentalStatus !== 'alert' ? 1 : 0),
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Vital Signs Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No vital signs data available. Record vitals to see trends.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Vital Signs Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="dateTime"
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                yAxisId="temp"
                orientation="left"
                domain={[35, 42]}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
                label={{ value: '°C', angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <YAxis 
                yAxisId="other"
                orientation="right"
                domain={['auto', 'auto']}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--chart-temp))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-temp))', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="Temp (°C)"
              />
              <Line
                yAxisId="other"
                type="monotone"
                dataKey="respiratoryRate"
                stroke="hsl(var(--chart-rr))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-rr))', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="RR (/min)"
              />
              <Line
                yAxisId="other"
                type="monotone"
                dataKey="systolicBP"
                stroke="hsl(var(--chart-sbp))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-sbp))', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="SBP (mmHg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
