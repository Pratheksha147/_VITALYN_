import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level?: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const config = {
  low: {
    icon: ShieldCheck,
    label: 'Low Risk',
    className: 'bg-risk-low text-risk-low-foreground',
  },
  moderate: {
    icon: AlertTriangle,
    label: 'Moderate Risk',
    className: 'bg-risk-moderate text-risk-moderate-foreground',
  },
  high: {
    icon: AlertCircle,
    label: 'High Risk',
    className: 'bg-risk-high text-risk-high-foreground',
  },
};

const sizeConfig = {
  sm: { badge: 'px-2 py-0.5 text-xs gap-1', icon: 'w-3 h-3' },
  md: { badge: 'px-2.5 py-1 text-sm gap-1.5', icon: 'w-4 h-4' },
  lg: { badge: 'px-3 py-1.5 text-base gap-2', icon: 'w-5 h-5' },
};

export function RiskBadge({ level, showLabel = true, size = 'md' }: RiskBadgeProps) {
  if (!level) {
    return (
      <span className={cn(
        'inline-flex items-center rounded-full font-medium',
        'bg-muted text-muted-foreground',
        sizeConfig[size].badge
      )}>
        <ShieldCheck className={sizeConfig[size].icon} />
        {showLabel && <span>No Data</span>}
      </span>
    );
  }

  const { icon: Icon, label, className } = config[level];

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      className,
      sizeConfig[size].badge
    )}>
      <Icon className={sizeConfig[size].icon} />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
