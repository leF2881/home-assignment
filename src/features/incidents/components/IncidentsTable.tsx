import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Spinner,
  Alert,
} from '@heroui/react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchIncidents,
  selectAllIncidents,
  selectIncidentsLoading,
  selectIncidentsError,
  updateIncidentStatus,
  startOptimisticUpdate,
  revertOptimisticUpdate,
} from '../incidentsSlice';
import { Incident } from '@/types/incident';
import { formatDistanceToNow } from 'date-fns';

const severityColors = {
  CRITICAL: 'danger',
  HIGH: 'warning',
  MEDIUM: 'default',
  LOW: 'primary',
} as const;

const statusColors = {
  OPEN: 'danger',
  RESOLVED: 'success',
  ESCALATED: 'warning',
} as const;

export default function IncidentsTable() {
  const dispatch = useAppDispatch();
  const incidents = useAppSelector(selectAllIncidents);
  const loading = useAppSelector(selectIncidentsLoading);
  const error = useAppSelector(selectIncidentsError);
  const [seenCriticalIds, setSeenCriticalIds] = useState<Set<string>>(new Set());
  const [showAlert, setShowAlert] = useState(false);
  const isInitialLoad = useRef(true);

  const criticalIncidents = useMemo(() => {
    return incidents.filter(incident => incident.severity === 'CRITICAL');
  }, [incidents]);

  // Track new critical incidents
  useEffect(() => {
    if (isInitialLoad.current) {
      // On initial load, mark all existing critical incidents as seen
      const criticalIds = new Set(
        criticalIncidents.map(incident => incident.id)
      );
      setSeenCriticalIds(criticalIds);
      isInitialLoad.current = false;
      return;
    }

    // Check for new critical incidents
    const newCriticalIncidents = criticalIncidents.filter(
      incident => !seenCriticalIds.has(incident.id)
    );

    if (newCriticalIncidents.length > 0) {
      // Mark new critical incidents as seen
      setSeenCriticalIds(prev => {
        const updated = new Set(prev);
        newCriticalIncidents.forEach(incident => {
          updated.add(incident.id);
        });
        return updated;
      });
      // Show alert for new critical incidents
      setShowAlert(true);
    }
  }, [criticalIncidents, seenCriticalIds]);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  const handleResolve = (incident: Incident) => {
    const originalStatus = incident.status;
    
    dispatch(startOptimisticUpdate({ id: incident.id, status: 'RESOLVED' }));
    
    dispatch(updateIncidentStatus({ id: incident.id, status: { status: 'RESOLVED' } }))
      .unwrap()
      .catch((error) => {
        console.error('Failed to resolve incident:', error);
        dispatch(revertOptimisticUpdate({
          id: incident.id,
          originalStatus,
          error: error?.error || 'Failed to resolve incident'
        }));
      });
  };

  const handleEscalate = (incident: Incident) => {
    const originalStatus = incident.status;
    
    dispatch(startOptimisticUpdate({ id: incident.id, status: 'ESCALATED' }));
    
    dispatch(updateIncidentStatus({ id: incident.id, status: { status: 'ESCALATED' } }))
      .unwrap()
      .catch((error) => {
        console.error('Failed to escalate incident:', error);
        dispatch(revertOptimisticUpdate({
          id: incident.id,
          originalStatus,
          error: error?.error || 'Failed to escalate incident'
        }));
      });
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const renderCell = (incident: Incident, columnKey: string) => {
    const isBusy = !!incident.optimisticUpdate;

    switch (columnKey) {
      case 'severity':
        const isCritical = incident.severity === 'CRITICAL';
        return (
          <motion.div
            animate={isCritical ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={isCritical ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            <Chip
              color={severityColors[incident.severity]}
              size="sm"
              variant="flat"
              className="font-semibold"
            >
              {incident.severity}
            </Chip>
          </motion.div>
        );

      case 'status':
        return (
          <Chip
            color={statusColors[incident.status]}
            size="sm"
            variant="dot"
            className="font-medium"
          >
            {incident.status}
          </Chip>
        );

      case 'category':
        return (
          <span className="text-sm font-medium text-zinc-200">
            {incident.category}
          </span>
        );

      case 'source':
        return (
          <code className="text-xs bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded font-mono text-zinc-300 break-all">
            {incident.source}
          </code>
        );

      case 'timestamp':
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-zinc-300 whitespace-nowrap">
              {formatTimestamp(incident.timestamp)}
            </span>
            <span className="text-[10px] text-zinc-600 whitespace-nowrap">
              {new Date(incident.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        );

      case 'actions':
        return (
          <div className="flex flex-col items-end gap-2">
            {incident.status === 'OPEN' ? (
              <div className="flex gap-2 flex-wrap justify-end">
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  onClick={() => handleResolve(incident)}
                  isDisabled={isBusy}
                  className="font-medium min-w-[80px]"
                >
                  {isBusy ? 'Processing...' : 'Resolve'}
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  onClick={() => handleEscalate(incident)}
                  isDisabled={isBusy}
                  className="font-medium min-w-[80px]"
                >
                  {isBusy ? 'Processing...' : 'Escalate'}
                </Button>
              </div>
            ) : (
              <span className="text-zinc-600 text-sm">—</span>
            )}
            
            {incident.error && (
              <div className="text-xs text-red-400 flex items-center gap-1.5 max-w-[200px]">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="break-words">{incident.error}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && incidents.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-400 mb-4 text-center px-4">{error}</div>
        <Button
          color="primary"
          variant="flat"
          onClick={() => dispatch(fetchIncidents())}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-zinc-500 mb-4">No incidents found</div>
        <Button
          color="primary"
          variant="flat"
          onClick={() => dispatch(fetchIncidents())}
        >
          Refresh
        </Button>
      </div>
    );
  }

  const columns = [
    { key: 'severity', label: 'SEVERITY' },
    { key: 'status', label: 'STATUS' },
    { key: 'category', label: 'CATEGORY' },
    { key: 'source', label: 'SOURCE' },
    { key: 'timestamp', label: 'TIME' },
    { key: 'actions', label: 'ACTIONS' },
  ];

  return (
    <div className="space-y-4">
      {/* Critical Incidents Alert - Only for new critical incidents */}
      {showAlert && criticalIncidents.length > 0 && (
        <Alert
          color="danger"
          variant="flat"
          title="Critical Incident Detected"
          description={`New critical incident${criticalIncidents.length !== 1 ? 's' : ''} require immediate attention`}
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table
          aria-label="Incidents table"
          removeWrapper
          classNames={{
            base: "overflow-x-auto",
            table: "min-w-full",
            thead: "[&>tr]:first:shadow-none",
            th: [
              "bg-zinc-900",
              "text-zinc-400",
              "border-b",
              "border-zinc-800",
              "text-xs",
              "font-semibold",
              "uppercase",
              "tracking-wider",
              "first:rounded-none",
              "last:rounded-none",
              "py-3.5",
            ].join(" "),
            td: [
              "py-4",
              "px-3",
              "align-top",
            ].join(" "),
            tr: [
              "border-b",
              "border-zinc-800",
              "hover:bg-zinc-900/50",
              "transition-colors",
              "data-[critical=true]:bg-red-950/10",
              "data-[critical=true]:border-red-900/30",
              "data-[optimistic=true]:opacity-60",
            ].join(" "),
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn 
                key={column.key}
                align={column.key === 'actions' ? 'end' : 'start'}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={incidents}>
            {(incident) => (
              <TableRow 
                key={incident.id}
                data-critical={incident.severity === 'CRITICAL'}
                data-optimistic={!!incident.optimisticUpdate}
              >
                {(columnKey) => (
                  <TableCell>
                    {renderCell(incident, columnKey as string)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {incidents.map((incident) => {
          const isBusy = !!incident.optimisticUpdate;
          const isCritical = incident.severity === 'CRITICAL';

          return (
            <div
              key={incident.id}
              className={`
                bg-zinc-900 border rounded-lg p-4 space-y-3
                ${isCritical ? 'border-red-900/50 bg-red-950/10' : 'border-zinc-800'}
                ${isBusy ? 'opacity-60' : ''}
              `}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                  {isCritical ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Chip
                        color={severityColors[incident.severity]}
                        size="sm"
                        variant="flat"
                        className="font-semibold"
                      >
                        {incident.severity}
                      </Chip>
                    </motion.div>
                  ) : (
                    <Chip
                      color={severityColors[incident.severity]}
                      size="sm"
                      variant="flat"
                      className="font-semibold"
                    >
                      {incident.severity}
                    </Chip>
                  )}
                  <Chip
                    color={statusColors[incident.status]}
                    size="sm"
                    variant="dot"
                    className="font-medium"
                  >
                    {incident.status}
                  </Chip>
                </div>
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  {formatTimestamp(incident.timestamp)}
                </span>
              </div>

              {/* Category */}
              <div>
                <div className="text-xs text-zinc-500 uppercase mb-1">Category</div>
                <div className="text-sm font-medium text-zinc-200">{incident.category}</div>
              </div>

              {/* Source */}
              <div>
                <div className="text-xs text-zinc-500 uppercase mb-1">Source</div>
                <code className="text-xs bg-zinc-950 border border-zinc-800 px-2 py-1 rounded font-mono text-zinc-300 break-all inline-block">
                  {incident.source}
                </code>
              </div>

              {/* Actions */}
              {incident.status === 'OPEN' && (
                <div className="flex gap-2 pt-2 border-t border-zinc-800">
                  <Button
                    size="sm"
                    color="success"
                    variant="flat"
                    onClick={() => handleResolve(incident)}
                    isDisabled={isBusy}
                    className="font-medium flex-1"
                  >
                    {isBusy ? 'Processing...' : 'Resolve'}
                  </Button>
                  <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    onClick={() => handleEscalate(incident)}
                    isDisabled={isBusy}
                    className="font-medium flex-1"
                  >
                    {isBusy ? 'Processing...' : 'Escalate'}
                  </Button>
                </div>
              )}

              {/* Error */}
              {incident.error && (
                <div className="text-xs text-red-400 flex items-center gap-1.5 pt-2 border-t border-zinc-800">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{incident.error}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="">
        <span className="text-sm text-zinc-500">
          Showing <span className="font-semibold text-zinc-400">{incidents.length}</span> incident{incidents.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}