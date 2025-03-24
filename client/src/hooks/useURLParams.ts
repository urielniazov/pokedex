import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortField, SortOrder } from '../types';

export const useURLParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Helper functions to get values from URL
  const getPage = (): number => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  };
  
  const getPageSize = (): number => {
    const pageSize = searchParams.get('pageSize');
    return pageSize ? parseInt(pageSize) : 10;
  };
  
  const getSortBy = (): SortField => {
    const sortBy = searchParams.get('sortBy') as SortField | null;
    return sortBy || 'number';
  };
  
  const getSortOrder = (): SortOrder => {
    const sortOrder = searchParams.get('sortOrder') as SortOrder | null;
    return sortOrder || 'asc';
  };
  
  const getSelectedType = (): string | undefined => {
    const type = searchParams.get('type');
    return type || undefined;
  };
  
  const getSearchQuery = (): string => {
    const search = searchParams.get('search');
    return search || '';
  };
  
  // Initialize state from URL
  const [page, setPage] = useState<number>(() => getPage());
  const [pageSize, setPageSize] = useState<number>(() => getPageSize());
  const [sortBy, setSortBy] = useState<SortField>(() => getSortBy());
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => getSortOrder());
  const [selectedType, setSelectedType] = useState<string | undefined>(() => getSelectedType());
  const [searchQuery, setSearchQuery] = useState<string>(() => getSearchQuery());
  
  // Cache for previous URL params to prevent unnecessary updates
  const urlParamsRef = useRef<string>('');
  
  // Update component state from URL params when URL changes
  useEffect(() => {
    const newPage = getPage();
    const newPageSize = getPageSize();
    const newSortBy = getSortBy();
    const newSortOrder = getSortOrder();
    const newSelectedType = getSelectedType();
    const newSearchQuery = getSearchQuery();
    
    // Only update state if values are different to prevent infinite loops
    if (page !== newPage) setPage(newPage);
    if (pageSize !== newPageSize) setPageSize(newPageSize);
    if (sortBy !== newSortBy) setSortBy(newSortBy);
    if (sortOrder !== newSortOrder) setSortOrder(newSortOrder);
    if (selectedType !== newSelectedType) setSelectedType(newSelectedType);
    if (searchQuery !== newSearchQuery) {
      setSearchQuery(newSearchQuery);
    }
  }, [searchParams]);
  
  // Update URL parameters when state changes
  useEffect(() => {
    const params: Record<string, string> = {};
    
    // Only add parameters that differ from defaults
    if (page !== 1) params.page = page.toString();
    if (pageSize !== 10) params.pageSize = pageSize.toString();
    if (sortBy !== 'number') params.sortBy = sortBy;
    if (sortOrder !== 'asc') params.sortOrder = sortOrder;
    if (selectedType) params.type = selectedType;
    if (searchQuery) params.search = searchQuery;
    
    // Convert current params to a string for comparison
    const paramsString = JSON.stringify(params);
    
    // Only update URL if params have changed
    if (paramsString !== urlParamsRef.current) {
      urlParamsRef.current = paramsString;
      setSearchParams(params);
    }
  }, [page, pageSize, sortBy, sortOrder, selectedType, searchQuery, setSearchParams]);
  
  return {
    page, setPage,
    pageSize, setPageSize,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    selectedType, setSelectedType,
    searchQuery, setSearchQuery
  };
};