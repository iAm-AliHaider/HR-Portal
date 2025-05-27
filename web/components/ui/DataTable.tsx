import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row?: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface Action<T> {
  label: string | React.ReactNode;
  onClick: (row: T) => void;
  color?: string;
  icon?: React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  sortable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  actions,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
  sortable = true,
  striped = true,
  hoverable = true,
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, sortable]);

  const requestSort = (key: string) => {
    if (!sortable) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortable) return null;
    
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === 'asc' 
        ? <span className="ml-1">↑</span> 
        : <span className="ml-1">↓</span>;
    }
    return <span className="ml-1 text-gray-300">↕</span>;
  };

  if (isLoading) {
    return (
      <div className={cn('w-full overflow-hidden rounded-xl bg-white shadow-sm', className)}>
        <div className="p-8 flex justify-center">
          <div className="animate-pulse w-full space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('w-full overflow-hidden rounded-xl bg-white shadow-sm', className)}>
        <div className="p-8 text-center text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  const getCellValue = (row: T, accessor: keyof T | string) => {
    if (typeof accessor === 'string' && accessor.includes('.')) {
      // Handle nested properties like 'user.name'
      const keys = accessor.split('.');
      let value: any = row;
      for (const key of keys) {
        if (value === null || value === undefined) return null;
        value = value[key];
      }
      return value;
    }
    return row[accessor as keyof T];
  };

  return (
    <div className={cn('w-full overflow-hidden rounded-xl bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, columnIndex) => (
                <th
                  key={column.key || columnIndex}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable !== false && sortable ? 'cursor-pointer select-none' : '',
                    column.className
                  )}
                  onClick={() => column.sortable !== false && requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable !== false && sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={cn(
                  striped && rowIndex % 2 === 1 ? 'bg-gray-50' : '',
                  hoverable ? 'hover:bg-gray-100' : '',
                  onRowClick ? 'cursor-pointer' : ''
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, columnIndex) => {
                  const value = getCellValue(row, column.accessor);
                  return (
                    <td
                      key={`${rowIndex}-${column.key || columnIndex}`}
                      className={cn(
                        'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                        column.className
                      )}
                    >
                      {column.cell ? column.cell(value, row) : value}
                    </td>
                  );
                })}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          className={cn(
                            'inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded',
                            action.color || 'text-indigo-600 hover:text-indigo-900'
                          )}
                        >
                          {action.icon && <span className="mr-1">{action.icon}</span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 
