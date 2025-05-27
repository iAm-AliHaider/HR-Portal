import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
  bgColor?: string;
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  className,
  bgColor = 'bg-white',
  iconBgColor = 'bg-primary-50 text-primary-500',
}) => {
  const changeColor = {
    positive: 'text-success-500',
    negative: 'text-error-500',
    neutral: 'text-gray-500',
  };

  const changeIcon = {
    positive: '↑',
    negative: '↓',
    neutral: '•',
  };

  return (
    <div className={cn(
      'rounded-xl shadow-sm p-6 flex flex-col gap-4 transition-shadow hover:shadow-md',
      bgColor,
      className
    )}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && (
          <div className={cn('p-2 rounded-lg', iconBgColor)}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={cn('text-sm flex items-center', changeColor[changeType])}>
            <span className="mr-1">{changeIcon[changeType]}</span>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard; 
