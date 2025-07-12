import { router } from '@inertiajs/react';
import { useCallback } from 'react';

const useSearchParamsQuery = (routeName?: string) => {
  const pathname = new URL(window.location.href).pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const searchParamsObject = Object.fromEntries(searchParams);

  const reset = useCallback((keysToPreserve: string[] = []) => {
    const currentParams = new URLSearchParams(window.location.search);
    const newParams: Record<string, string> = {};

    // Preserve specified keys
    keysToPreserve.forEach(key => {
      if (currentParams.has(key)) {
        newParams[key] = currentParams.get(key)!;
      }
    });

    const url = routeName ? route(routeName) : pathname;
    router.get(url, newParams, { preserveState: true, preserveScroll: true });
  }, [routeName, pathname]);

  const applyFilter = useCallback((keyOrFilters: string | Record<string, any>, value?: any, options = {}) => {
    const cleanedFilters: Record<string, any> = {};
    const currentParams = Object.fromEntries(new URLSearchParams(window.location.search));

    // Start with current parameters
    Object.assign(cleanedFilters, currentParams);

    // If first argument is an object, treat it as multiple filters
    if (typeof keyOrFilters === 'object' && keyOrFilters !== null) {
      Object.entries(keyOrFilters).forEach(([key, val]) => {
        if (!val || val === '' || val === 'all') {
          delete cleanedFilters[key];
        } else {
          cleanedFilters[key] = val;
        }
      });
    } else {
      // Handle single filter
      const key = keyOrFilters;
      if (!value || value === '' || value === 'all') {
        delete cleanedFilters[key];
      } else {
        cleanedFilters[key] = value;
      }
    }

    const url = routeName ? route(routeName) : pathname;
    router.get(url, cleanedFilters, {
      preserveState: true,
      preserveScroll: true,
      ...options
    });
  }, [routeName, pathname]);

  const hasSearchParams = useCallback((ignoreKeys: string[] = []) => {
    const current = new URLSearchParams(window.location.search);

    for (const key of current.keys()) {
      if (!ignoreKeys.includes(key)) {
        return true;
      }
    }

    return false;
  }, []);

  return {
    applyFilter,
    searchParams,
    searchParamsObject,
    hasSearchParams,
    reset,
  };
};

export default useSearchParamsQuery;