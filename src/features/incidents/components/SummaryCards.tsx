import { Card, CardBody } from '@heroui/react';
import { useAppSelector } from '@/app/hooks';
import { selectSeverityCounts } from '../incidentsSlice';
//The summary cards aggregate incidents by severity only; status changes do not impact the summary since severity remains unchanged.
const severityConfig = {
  CRITICAL: {
    label: 'Critical',
    color: 'text-red-400',
    border: 'border-red-900/50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  HIGH: {
    label: 'High',
    color: 'text-orange-400',
    border: 'border-orange-900/50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-yellow-400',
    border: 'border-yellow-900/50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  LOW: {
    label: 'Low',
    color: 'text-blue-400',
    border: 'border-blue-900/50',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function SummaryCards() {
  const counts = useAppSelector(selectSeverityCounts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(severityConfig).map(([severity, config]) => {
        const count = counts[severity] || 0;
        
        return (
          <Card 
            key={severity}
            className={`${config} border ${config.border}`}
          >
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">{config.label}</p>
                  <p className={`text-3xl font-bold text-white-400`}>{count}</p>
                </div>
                <div className={config.color}>
                  {config.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}