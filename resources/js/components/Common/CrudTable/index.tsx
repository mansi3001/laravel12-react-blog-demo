import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Filter, Download, Grid, List, Settings, 
  Edit, Eye, Trash2, MoreHorizontal, ArrowUpDown, RotateCcw,
  ChevronDown, ChevronUp, GripVertical 
} from 'lucide-react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { TableColumn, CrudTableConfig } from '@/types/common';
import NoDataFound from '@/components/Common/NoDataFound';

interface CrudTableProps {
  data: any[];
  columns: TableColumn[];
  config: CrudTableConfig;
  loading?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
  onSearch?: (search: string) => void;
  onFilter?: (filters: any) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onExport?: (format: string) => void;
  onReset?: () => void;
  viewMode?: 'table' | 'grid';
  onViewModeChange?: (mode: 'table' | 'grid') => void;
  onRowReorder?: (fromIndex: number, toIndex: number) => void;
  customActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (row: any) => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    show?: (row: any) => boolean;
  }>;
  filters?: React.ReactNode;
  pagination?: {
    current: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    perPageOptions?: number[];
  };
}

export default function CrudTable({
  data,
  columns,
  config,
  loading = false,
  selectedIds = [],
  onSelectionChange,
  onEdit,
  onView,
  onDelete,
  onBulkDelete,
  onSearch,
  onFilter,
  onSort,
  onExport,
  onReset,
  viewMode: externalViewMode = 'table',
  onViewModeChange,
  onRowReorder,
  customActions = [],
  filters,
  pagination
}: CrudTableProps) {
  const [search, setSearch] = useState('');
  const [internalViewMode, setInternalViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [orderedColumns, setOrderedColumns] = useState<TableColumn[]>(columns);
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);
  
  const viewMode = onViewModeChange ? externalViewMode : internalViewMode;
  const setViewMode = onViewModeChange || setInternalViewMode;

  useEffect(() => {
    setOrderedColumns(columns);
  }, [columns]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedColumn(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedColumn === null) return;

    const newColumns = [...orderedColumns];
    const draggedItem = newColumns[draggedColumn];
    newColumns.splice(draggedColumn, 1);
    newColumns.splice(dropIndex, 0, draggedItem);
    
    setOrderedColumns(newColumns);
    setDraggedColumn(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalData(items);
    onRowReorder?.(result.source.index, result.destination.index);
  };
  
  const hasAppliedFilters = () => {
    const params = new URLSearchParams(window.location.search);
    const filterKeys = ['status', 'category_id', 'date_from', 'date_to'];
    return filterKeys.some(key => params.has(key) && params.get(key) !== '');
  };
  const [sortConfig, setSortConfig] = useState<{column: string, direction: 'asc' | 'desc'} | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  const handleReset = () => {
    setIsResetting(true);
    setSearch('');
    onReset?.();
    setTimeout(() => setIsResetting(false), 500);
  };

  const handleSort = (column: string) => {
    const direction = sortConfig?.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, direction });
    onSort?.(column, direction);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(data.map(item => item.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedIds, id]);
    } else {
      onSelectionChange?.(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const renderTableView = () => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            {config.reorder && onRowReorder && (
              <TableHead className="w-12">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </TableHead>
            )}
            {config.bulkActions && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {orderedColumns.map((column, index) => (
              <TableHead 
                key={column.key} 
                className={`${column.width} ${config.reorder ? 'cursor-move' : ''}`}
                draggable={config.reorder}
                onDragStart={(e) => config.reorder && handleDragStart(e, index)}
                onDragOver={(e) => config.reorder && handleDragOver(e)}
                onDrop={(e) => config.reorder && handleDrop(e, index)}
              >
                <div className="flex items-center space-x-2">
                  <span>{column.label}</span>
                  {column.sortable && config.sorting && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(column.key)}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {config.reorder && onRowReorder ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="table-rows">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {hasData ? (
                    localData.map((row, index) => (
                      <Draggable key={row.id} draggableId={row.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 ${snapshot.isDragging ? 'bg-blue-50 shadow-lg' : ''}`}
                          >
                            <TableCell className="text-center font-medium">
                              {pagination ? ((pagination.current - 1) * pagination.perPage) + index + 1 : index + 1}
                            </TableCell>
                            <TableCell className="cursor-move p-2" {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </TableCell>
                            {config.bulkActions && (
                              <TableCell>
                                <Checkbox
                                  checked={selectedIds.includes(row.id)}
                                  onCheckedChange={(checked) => handleSelectItem(row.id, checked as boolean)}
                                />
                              </TableCell>
                            )}
                            {orderedColumns.map(column => (
                              <TableCell key={column.key}>
                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                              </TableCell>
                            ))}
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {onView && (
                                    <DropdownMenuItem onClick={() => onView(row)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                  )}
                                  {onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(row)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  {customActions.map((action, index) => {
                                    if (action.show && !action.show(row)) return null;
                                    return (
                                      <DropdownMenuItem 
                                        key={index}
                                        onClick={() => action.onClick(row)}
                                        className={action.variant === 'destructive' ? 'text-red-600' : ''}
                                      >
                                        {action.icon && <span className="mr-2">{action.icon}</span>}
                                        {action.label}
                                      </DropdownMenuItem>
                                    );
                                  })}
                                  {onDelete && (
                                    <DropdownMenuItem 
                                      onClick={() => onDelete(row.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={orderedColumns.length + 3} className="h-64">
                        <NoDataFound 
                          title="No Records Found" 
                          description="There are no records to display. Start by adding some data."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <TableBody>
            {hasData ? (
              localData.map((row, index) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {config.bulkActions && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onCheckedChange={(checked) => handleSelectItem(row.id, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {orderedColumns.map(column => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-medium">
                    {pagination ? ((pagination.current - 1) * pagination.perPage) + index + 1 : index + 1}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {customActions.map((action, index) => {
                          if (action.show && !action.show(row)) return null;
                          return (
                            <DropdownMenuItem 
                              key={index}
                              onClick={() => action.onClick(row)}
                              className={action.variant === 'destructive' ? 'text-red-600' : ''}
                            >
                              {action.icon && <span className="mr-2">{action.icon}</span>}
                              {action.label}
                            </DropdownMenuItem>
                          );
                        })}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(row.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={orderedColumns.length + 2} className="h-64">
                  <NoDataFound 
                    title="No Records Found" 
                    description="There are no records to display. Start by adding some data."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}

      </Table>
    </div>
  );

  const renderGridView = () => {
    if (!hasData) {
      return (
        <div className="text-center py-12">
          <NoDataFound 
            title="No Records Found" 
            description="There are no records to display. Start by adding some data."
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map(row => {
          const imageColumn = columns.find(col => col.key === 'image');
          const titleColumn = columns.find(col => col.key === 'title');
          const statusColumn = columns.find(col => col.key === 'status');
          const categoryColumn = columns.find(col => col.key === 'category');
          const dateColumn = columns.find(col => col.key === 'created_at');
          
          return (
            <Card key={row.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              {imageColumn && row[imageColumn.key] && (
                <div className="relative h-32 bg-gray-100">
                  <img
                    src={row[imageColumn.key].startsWith('http') ? row[imageColumn.key] : `/storage/${row[imageColumn.key]}`}
                    alt={row.title || 'Image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/400x200?text=No+Image';
                    }}
                  />
                  {config.bulkActions && (
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onCheckedChange={(checked) => handleSelectItem(row.id, checked as boolean)}
                        className="bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  )}
                </div>
              )}
              
              <CardContent className="p-3">
                {titleColumn && (
                  <div className="mb-2">
                    <h3 className="font-semibold text-base text-gray-900 line-clamp-2">
                      {titleColumn.render ? titleColumn.render(row[titleColumn.key], row) : row[titleColumn.key]}
                    </h3>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-2">
                  {statusColumn && (
                    <div>
                      {statusColumn.render ? statusColumn.render(row[statusColumn.key], row) : (
                        <Badge variant={row[statusColumn.key] === 'published' ? 'default' : 'secondary'}>
                          {row[statusColumn.key]}
                        </Badge>
                      )}
                    </div>
                  )}
                  {categoryColumn && (
                    <div className="text-sm text-gray-600">
                      {categoryColumn.render ? categoryColumn.render(row[categoryColumn.key], row) : row[categoryColumn.key]}
                    </div>
                  )}
                </div>
                
                {dateColumn && (
                  <div className="text-xs text-gray-500 mb-3">
                    {dateColumn.render ? dateColumn.render(row[dateColumn.key], row) : 
                      new Date(row[dateColumn.key]).toLocaleDateString()
                    }
                  </div>
                )}
                
                <div className="flex justify-end space-x-1 pt-2 border-t border-gray-100">
                  {(() => {
                    const availableActions = [
                      ...(onView ? [{ type: 'view', icon: <Eye className="h-4 w-4" />, label: 'View', onClick: () => onView(row) }] : []),
                      ...(onEdit ? [{ type: 'edit', icon: <Edit className="h-4 w-4" />, label: 'Edit', onClick: () => onEdit(row) }] : []),
                      ...customActions.filter(action => !action.show || action.show(row)).map(action => ({
                        type: 'custom',
                        icon: action.icon,
                        label: action.label,
                        onClick: () => action.onClick(row)
                      })),
                      ...(onDelete ? [{ type: 'delete', icon: <Trash2 className="h-4 w-4" />, label: 'Delete', onClick: () => onDelete(row.id), className: 'text-red-600 hover:text-red-700' }] : [])
                    ];

                    if (availableActions.length <= 4) {
                      return availableActions.map((action, index) => (
                        <Button 
                          key={index}
                          variant="ghost" 
                          size="sm" 
                          onClick={action.onClick}
                          title={action.label}
                          className={action.className}
                        >
                          {action.icon}
                        </Button>
                      ));
                    } else {
                      return (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" title="More actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {availableActions.map((action, index) => (
                              <DropdownMenuItem 
                                key={index}
                                onClick={action.onClick}
                                className={action.type === 'delete' ? 'text-red-600' : ''}
                              >
                                <span className="mr-2">{action.icon}</span>
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    }
                  })()
                }
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const hasData = localData && localData.length > 0;

  return (
    <div className="space-y-4">
      {/* Header - Show based on data availability and applied filters */}
      {(hasData || search || hasAppliedFilters()) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            {config.search && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`pl-10 w-64 transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                />
              </div>
            )}
            {config.filters && (hasData || hasAppliedFilters()) && (
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {showFilters ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            )}
            {onReset && (
              <Button
                variant="outline"
                onClick={handleReset}
                title="Reset all filters and search"
                disabled={isResetting}
              >
                <RotateCcw className={`mr-2 h-4 w-4 transition-transform duration-500 ${isResetting ? 'animate-spin' : ''}`} />
                Reset
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {config.bulkActions && selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onBulkDelete?.(selectedIds)}
              >
                Delete Selected ({selectedIds.length})
              </Button>
            )}
            {config.export && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onExport?.('excel')}>
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport?.('pdf')}>
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport?.('csv')}>
                    CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {config.viewToggle && (
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && filters && (hasData || hasAppliedFilters()) && (
        <div className="mb-4">
          {filters}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        viewMode === 'table' ? renderTableView() : renderGridView()
      )}

      {/* Pagination - Only show if there's data */}
      {hasData && pagination && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Showing {((pagination.current - 1) * pagination.perPage) + 1} to{' '}
              {Math.min(pagination.current * pagination.perPage, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            {pagination.onPerPageChange && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select
                  value={String(pagination.perPage)}
                  onValueChange={(value) => pagination.onPerPageChange?.(Number(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(pagination.perPageOptions || [10, 25, 50, 100]).map(option => (
                      <SelectItem key={option} value={String(option)}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current === 1}
              onClick={() => pagination.onPageChange(pagination.current - 1)}
            >
              Previous
            </Button>
            
            {(() => {
              const totalPages = Math.ceil(pagination.total / pagination.perPage);
              const current = pagination.current;
              const pages = [];
              
              if (totalPages <= 5) {
                // Show all pages if 5 or less
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={current === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => pagination.onPageChange(i)}
                    >
                      {i}
                    </Button>
                  );
                }
              } else {
                // Complex pagination for more than 5 pages
                
                // Always show page 1
                pages.push(
                  <Button
                    key={1}
                    variant={current === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => pagination.onPageChange(1)}
                  >
                    1
                  </Button>
                );
                
                // Show ellipsis after page 1 if needed
                if (current > 3) {
                  pages.push(
                    <span key="start-ellipsis" className="px-2 text-gray-500">...</span>
                  );
                }
                
                // Show pages around current page
                let start = Math.max(2, current - 1);
                let end = Math.min(totalPages - 1, current + 1);
                
                // Adjust range to avoid duplicates with first/last page
                if (start === 2 && current <= 3) {
                  end = Math.min(totalPages - 1, 4);
                }
                if (end === totalPages - 1 && current >= totalPages - 2) {
                  start = Math.max(2, totalPages - 3);
                }
                
                for (let i = start; i <= end; i++) {
                  if (i > 1 && i < totalPages) {
                    pages.push(
                      <Button
                        key={i}
                        variant={current === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => pagination.onPageChange(i)}
                      >
                        {i}
                      </Button>
                    );
                  }
                }
                
                // Show ellipsis before last page if needed
                if (current < totalPages - 2) {
                  pages.push(
                    <span key="end-ellipsis" className="px-2 text-gray-500">...</span>
                  );
                }
                
                // Always show last page
                pages.push(
                  <Button
                    key={totalPages}
                    variant={current === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => pagination.onPageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                );
              }
              
              return pages;
            })()}
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.perPage)}
              onClick={() => pagination.onPageChange(pagination.current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}