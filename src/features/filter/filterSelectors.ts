import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { Incident } from '@/types/incident';
import { selectAllIncidents } from '@/features/incidents/incidentsSlice';
import { FilterState, SortField } from './filterSlice';

// Severity order for sorting
const severityOrder: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export const selectFilteredIncidents = createSelector(
  [selectAllIncidents, (state: RootState) => state.filter],
  (incidents: Incident[], filters: FilterState): Incident[] => {
    let filtered = [...incidents];

    // Filter by severity
    if (filters.severities.length > 0) {
      filtered = filtered.filter((incident) =>
        filters.severities.includes(incident.severity)
      );
    }

    // Filter by status
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((incident) =>
        filters.statuses.includes(incident.status)
      );
    }

    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter((incident) =>
        filters.categories.includes(incident.category)
      );
    }

    // Filter by source search
    if (filters.searchSource) {
      const searchLower = filters.searchSource.toLowerCase();
      filtered = filtered.filter((incident) =>
        incident.source.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (filters.sortField === 'timestamp') {
        comparison =
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (filters.sortField === 'severity') {
        comparison =
          severityOrder[a.severity] - severityOrder[b.severity];
      }

      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }
);
