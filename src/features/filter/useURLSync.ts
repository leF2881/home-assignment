import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setSeverities,
  setStatuses,
  setCategories,
  setSearchSource,
  setSortField,
  setFiltersFromURL,
  resetFilters,
} from './filterSlice';
import { Severity, Status, Category } from '@/types/incident';
import { SortField } from './filterSlice';

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
    const sortFieldParam = searchParams.get('sortField') as SortField;
    const sortField = sortFieldParam || 'timestamp';

    // Check if there are any URL params to load
    const hasURLParams = 
      (severities && severities.length > 0) ||
      (statuses && statuses.length > 0) ||
      (categories && categories.length > 0) ||
      searchSource ||
      sortFieldParam;

    if (hasURLParams) {
      isUpdatingFromURL.current = true;
      dispatch(setFiltersFromURL({
        severities: severities || [],
        statuses: statuses || [],
        categories: categories || [],
        searchSource,
        sortField,
      }));
      // Reset the flag after state update completes
      setTimeout(() => {
        isUpdatingFromURL.current = false;
      }, 0);
    } else {
      // No URL params, so we can immediately allow URL updates
      isUpdatingFromURL.current = false;
    }
    isInitialMount.current = false;
  }, []); // Only on mount - searchParams is stable from useSearchParams

  // Update URL when filters change (but not when updating from URL)
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    if (isUpdatingFromURL.current) {
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
    if (filters.sortField !== 'timestamp') {
      params.set('sortField', filters.sortField);
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
    searchParams,
    setSearchParams,
  ]);

  const handleResetFilters = () => {
    // Reset filters in state first
    dispatch(resetFilters());
    // Clear URL params immediately
    setSearchParams(new URLSearchParams(), { replace: true });
    // Reset the flag to allow future URL updates
    isUpdatingFromURL.current = false;
  };

  return {
    filters,
    setSeverities: (severities: Severity[]) => dispatch(setSeverities(severities)),
    setStatuses: (statuses: Status[]) => dispatch(setStatuses(statuses)),
    setCategories: (categories: Category[]) => dispatch(setCategories(categories)),
    setSearchSource: (search: string) => dispatch(setSearchSource(search)),
    setSortField: (field: SortField) => dispatch(setSortField(field)),
    resetFilters: handleResetFilters,
  };
}
