import { useState, useCallback } from 'react';
import useSearchParamsQuery from './useSearchParamsQuery';

interface UseCrudTableProps {
  routeName: string;
  defaultPerPage?: number;
  viewMode?: 'table' | 'grid';
}

export default function useCrudTable({ routeName, defaultPerPage, viewMode = 'table' }: UseCrudTableProps) {
  const getDefaultPerPage = () => {
    if (defaultPerPage) return defaultPerPage;
    return viewMode === 'grid' ? 12 : 10;
  };
  
  const getPerPageOptions = () => {
    return viewMode === 'grid' 
      ? [12, 24, 36, 48, 60]
      : [5, 10, 25, 50, 100];
  };
  const { applyFilter, reset: resetParams, searchParamsObject } = useSearchParamsQuery(routeName);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPerPage, setCurrentPerPage] = useState(
    searchParamsObject.per_page ? Number(searchParamsObject.per_page) : getDefaultPerPage()
  );

  const handleSearch = useCallback((search: string) => {
    applyFilter({ search, page: 1 });
  }, [applyFilter]);

  const handleSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    applyFilter({ sort_by: column, sort_order: direction, page: 1 });
  }, [applyFilter]);

  const handlePageChange = useCallback((page: number) => {
    applyFilter({ page, per_page: currentPerPage });
  }, [applyFilter, currentPerPage]);

  const handlePerPageChange = useCallback((perPage: number) => {
    setCurrentPerPage(perPage);
    applyFilter({ per_page: perPage, page: 1 });
  }, [applyFilter]);

  const handleFilter = useCallback((filters: Record<string, any>) => {
    applyFilter({ ...filters, page: 1 });
  }, [applyFilter]);

  const handleReset = useCallback(() => {
    setCurrentPerPage(getDefaultPerPage());
    setSelectedIds([]);
    resetParams();
  }, [resetParams, viewMode]);

  const handleExport = useCallback((format: string) => {
    const baseUrl = route(routeName).replace(/\/+$/, '');
    const params = new URLSearchParams(searchParamsObject);
    params.set('format', format);
    window.open(`${baseUrl}/export?${params.toString()}`, '_blank');
  }, [routeName, searchParamsObject]);

  const handleViewModeChange = useCallback((newViewMode: 'table' | 'grid') => {
    const newPerPage = newViewMode === 'grid' ? 12 : 10;
    setCurrentPerPage(newPerPage);
    applyFilter({ per_page: newPerPage, page: 1 });
  }, [applyFilter]);

  return {
    // State
    selectedIds,
    setSelectedIds,
    currentPerPage,
    searchParamsObject,
    
    // Handlers
    handleSearch,
    handleSort,
    handlePageChange,
    handlePerPageChange,
    handleFilter,
    handleReset,
    handleExport,
    
    // Utils
    applyFilter,
    resetParams,
    getPerPageOptions,
    getDefaultPerPage,
    handleViewModeChange
  };
}