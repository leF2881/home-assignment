import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setSeverities,
  setStatuses,
  setCategories,
  setSearchSource,
  setSortField,
  setSortOrder,
  setFiltersFromURL,
  resetFilters,
} from './filterSlice';
import { Severity, Status, Category } from '@/types/incident';
import { SortField, SortOrder } from './filterSlice';

export function useURLSync() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useAppSelector((state) => state.filter);
  const isInitialMount = useRef(true);
  const isUpdatingFromURL = useRef(false);

  // Load filters from URL on mount
  useEffect(() => {
    if (!isInitialMount.current) return;
    
    const severities = searchParams.get('severities')?.split(',').filter(Boolean) as Severity[] | undefined;
    const statuses = searchParams.get('statuses')?.split(',').filter(Boolean) as Status[] | undefined;
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) as Category[] | undefined;
    const searchSource = searchParams.get('search') || '';
    const sortField = (searchParams.get('sortField') as SortField) || 'timestamp';
    const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';

    if (severities || statuses || categories || searchSource || sortField || sortOrder) {
      isUpdatingFromURL.current = true;
      dispatch(setFiltersFromURL({
        severities: severities || [],
        statuses: statuses || [],
        categories: categories || [],
        searchSource,
        sortField,
        sortOrder,
      }));
    }
    isInitialMount.current = false;
  }, []); // Only on mount

  // Update URL when filters change (but not when updating from URL)
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    if (isUpdatingFromURL.current) {
      // Don't reset the flag here - let handleResetFilters handle it
      return;
    }

    const params = new URLSearchParams();

    if (filters.severities.length > 0) {
      params.set('severities', filters.severities.join(','));
    }
    if (filters.statuses.length > 0) {
      params.set('statuses', filters.statuses.join(','));
    }
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','));
    }
    if (filters.searchSource) {
      params.set('search', filters.searchSource);
    }
    if (filters.sortField !== 'timestamp' || filters.sortOrder !== 'desc') {
      params.set('sortField', filters.sortField);
      params.set('sortOrder', filters.sortOrder);
    }

    // Only update if params actually changed
    const currentParams = searchParams.toString();
    const newParams = params.toString();
    
    if (currentParams !== newParams) {
      // If new params are empty, clear URL completely
      if (newParams === '') {
        setSearchParams(new URLSearchParams(), { replace: true });
      } else {
        setSearchParams(params, { replace: true });
      }
    }
  }, [
    filters.severities,
    filters.statuses,
    filters.categories,
    filters.searchSource,
    filters.sortField,
    filters.sortOrder,
    searchParams,
    setSearchParams,
  ]);

  const handleResetFilters = () => {
    // Reset filters in state first
    dispatch(resetFilters());
    // Clear URL params - the useEffect will handle this, but we do it immediately too
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return {
    filters,
    setSeverities: (severities: Severity[]) => dispatch(setSeverities(severities)),
    setStatuses: (statuses: Status[]) => dispatch(setStatuses(statuses)),
    setCategories: (categories: Category[]) => dispatch(setCategories(categories)),
    setSearchSource: (search: string) => dispatch(setSearchSource(search)),
    setSortField: (field: SortField) => dispatch(setSortField(field)),
    setSortOrder: (order: SortOrder) => dispatch(setSortOrder(order)),
    resetFilters: handleResetFilters,
  };
}
