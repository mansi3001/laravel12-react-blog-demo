import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Copy } from 'lucide-react';
import CrudTable from '@/components/Common/CrudTable';
import CrudForm from '@/components/Common/CrudForm';
import { Blog, Category, BlogFilters, BlogFormData } from '@/types/blog';
import { TableColumn, FormField } from '@/types/common';
import AppLayout from '@/layouts/app-layout';
import useCrudTable from '@/hooks/useCrudTable';
import { validateBlogForm } from '@/validations/blogValidation';
import ConfirmDialog from '@/components/Common/ConfirmDialog';

interface Country {
  id: number;
  name: string;
  code: string;
}

interface Course {
  id: number;
  name: string;
}

interface BlogIndexProps {
  blogs: {
    data: Blog[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  categories: Category[];
  countries: Country[];
  courses: Course[];
}

export default function BlogIndex({ blogs, categories, countries = [], courses = [] }: BlogIndexProps) {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const {
    selectedIds,
    setSelectedIds,
    currentPerPage,
    handleSearch,
    handleSort,
    handlePageChange,
    handlePerPageChange,
    handleReset,
    handleExport,
    getPerPageOptions,
    handleViewModeChange,
    applyFilter
  } = useCrudTable({ routeName: 'blogs.index', viewMode });
  
  const handleViewToggle = (mode: 'table' | 'grid') => {
    setViewMode(mode);
    handleViewModeChange(mode);
  };

  const handleLocalReset = () => {
    setFilters({
      status: 'all',
      category_id: 'all',
      date_from: '',
      date_to: ''
    });
    handleReset();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Convert 'all' to empty string for backend
    const filterValue = value === 'all' ? '' : value;
    applyFilter({ [key]: filterValue, page: 1 });
  };
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk', id?: number, ids?: number[] } | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category_id: 'all',
    date_from: '',
    date_to: ''
  });
  
  const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm<BlogFormData>({
    title: '',
    content: '',
    image: undefined,
    status: 'draft',
    tags: [],
    category_id: 0
  });

  const columns: TableColumn[] = [
    {
      key: 'image',
      label: 'Image',
      width: 'w-20',
      render: (value, row) => (
        <div className="w-16 h-12">
          {value ? (
            <img
              src={value.startsWith('http') ? value : `/storage/${value}`}
              alt="Blog image"
              className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                setSelectedImage({
                  url: value.startsWith('http') ? value : `/storage/${value}`,
                  title: row.title
                });
                setShowImageModal(true);
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/64x48?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.slug}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'published' ? 'default' : value === 'draft' ? 'secondary' : 'destructive'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => value?.name
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 3}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'user',
      label: 'Author',
      render: (value) => value?.name
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const formFields: FormField[] = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter blog title',
      column: 2
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      required: true,
      placeholder: 'Enter blog content',
      column: 3
    },
    {
      name: 'category_id',
      label: 'Category',
      type: 'select',
      required: true,
      options: categories.map(cat => ({ value: cat.id, label: cat.name })),
      placeholder: 'Select category'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ],
      placeholder: 'Select status'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'dependent-dropdown',
      column: 3,
      dependentConfig: [
        {
          name: 'country_id',
          label: 'Country',
          options: countries.map(country => ({ value: country.id, label: country.name }))
        },
        {
          name: 'state_id',
          label: 'State',
          apiEndpoint: '/blogs/states/{country_id}'
        },
        {
          name: 'city_id',
          label: 'City',
          apiEndpoint: '/blogs/cities/{state_id}'
        }
      ],
    },
    {
      name: 'education',
      label: 'Education',
      type: 'dependent-dropdown',
      column: 2,
      dependentConfig: [
        {
          name: 'course_id',
          label: 'Course',
          options: courses.map(course => ({ value: course.id, label: course.name }))
        },
        {
          name: 'subject_id',
          label: 'Subject',
          apiEndpoint: '/blogs/subjects/{course_id}'
        }
      ],
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'radio',
      required: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ],
      column: 2
    },
    {
      name: 'is_featured',
      label: 'Featured Post',
      type: 'checkbox'
    },
    {
      name: 'skills',
      label: 'Skills',
      type: 'multi-select',
      options: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'php', label: 'PHP' },
        { value: 'python', label: 'Python' },
        { value: 'react', label: 'React' },
        { value: 'laravel', label: 'Laravel' }
      ],
      placeholder: 'Select skills',
      column: 2
    },
    {
      name: 'publish_date',
      label: 'Publish Date',
      type: 'date'
    },
    {
      name: 'is_active',
      label: 'Active Status',
      type: 'switch'
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'multi-select',
      placeholder: 'Add tags',
      column: 2
    },
    {
      name: 'image',
      label: 'Featured Image',
      type: 'file',
      accept: 'image/*'
    }
  ];

  const handleCreate = () => {
    setModalMode('create');
    setEditingBlog(null);
    reset();
    setShowModal(true);
  };

  const handleEdit = (blog: Blog) => {
    setModalMode('edit');
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleView = (blog: Blog) => {
    setModalMode('view');
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteTarget({ type: 'single', id });
    setShowDeleteDialog(true);
  };

  const handleBulkDelete = (ids: number[]) => {
    setDeleteTarget({ type: 'bulk', ids });
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteTarget?.type === 'single' && deleteTarget.id) {
      router.delete(`/blogs/${deleteTarget.id}`);
    } else if (deleteTarget?.type === 'bulk' && deleteTarget.ids) {
      router.post('/blogs/bulk-delete', { ids: deleteTarget.ids }, {
        onSuccess: () => setSelectedIds([])
      });
    }
    setDeleteTarget(null);
  };

  const handleRowReorder = (fromIndex: number, toIndex: number) => {
    const items = [...blogs.data];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    
    const orderedIds = items.map(item => item.id);
    
    router.post('/blogs/reorder', {
      ordered_ids: orderedIds
    }, {
      preserveScroll: true,
      preserveState: true
    });
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsSubmitting(true);
    
    console.log('Form data received:', formData);
    
    // Prepare form data for submission
    const submitData = {
      title: formData.title || '',
      content: formData.content || '',
      status: formData.status || 'draft',
      category_id: formData.category_id || 0,
      tags: formData.tags || [],
      priority: formData.priority || 'medium',
      country_id: formData.country_id || '',
      state_id: formData.state_id || '',
      city_id: formData.city_id || '',
      course_id: formData.course_id || '',
      subject_id: formData.subject_id || '',
      skills: formData.skills || [],
      publish_date: formData.publish_date || '',
      is_featured: formData.is_featured || false,
      is_active: formData.is_active !== undefined ? formData.is_active : true,
      image: formData.image || null
    };
    
    console.log('Submit data prepared:', submitData);
    
    if (modalMode === 'create') {
      router.post('/blogs', submitData, {
        onSuccess: () => {
          setShowModal(false);
          reset();
          clearErrors();
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
        preserveState: true,
        preserveScroll: true
      });
    } else if (editingBlog) {
      // Use POST with _method for file uploads
      const updateData = { ...submitData, _method: 'PUT' };
      router.post(`/blogs/${editingBlog.id}`, updateData, {
        onSuccess: () => {
          setShowModal(false);
          reset();
          clearErrors();
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
        preserveState: true,
        preserveScroll: true
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Blogs" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog
          </Button>
        </div>

        <CrudTable
          data={blogs.data || []}
          columns={columns}
          config={{
            search: true,
            filters: true,
            export: true,
            bulkActions: true,
            viewToggle: true,
            columnSettings: true,
            pagination: true,
            sorting: true,
            reorder: true
          }}
          viewMode={viewMode}
          onViewModeChange={handleViewToggle}
          customActions={[
            {
              label: 'Duplicate',
              icon: <Copy className="h-4 w-4" />,
              onClick: (blog) => {
                router.post('/blogs', {
                  ...blog,
                  title: `${blog.title} (Copy)`,
                  slug: `${blog.slug}-copy`
                });
              },
              variant: 'outline'
            },
          ]}
          loading={processing}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onSearch={handleSearch}
          onSort={handleSort}
          onExport={handleExport}
          onReset={handleLocalReset}
          onRowReorder={handleRowReorder}
          filters={
            <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.category_id} onValueChange={(value) => handleFilterChange('category_id', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                placeholder="From Date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-40"
              />
              
              <Input
                type="date"
                placeholder="To Date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-40"
              />
            </div>
          }
          pagination={{
            current: blogs.meta?.current_page || 1,
            total: blogs.meta?.total || 0,
            perPage: currentPerPage,
            lastPage: blogs.meta?.last_page || 1,
            onPageChange: handlePageChange,
            onPerPageChange: handlePerPageChange,
            perPageOptions: getPerPageOptions()
          }}
        />

        <CrudForm
          isOpen={showModal}
          onClose={() => {
            if (!isSubmitting) {
              setShowModal(false);
              setEditingBlog(null);
              reset();
              clearErrors();
            }
            setIsSubmitting(false);
          }}
          title={modalMode === 'create' ? 'Create Blog' : modalMode === 'edit' ? 'Edit Blog' : 'View Blog'}
          fields={formFields}
          data={(modalMode === 'edit' || modalMode === 'view') && editingBlog ? {
            title: editingBlog.title || '',
            content: editingBlog.content || '',
            status: editingBlog.status || 'draft',
            category_id: editingBlog.category?.id || '',
            tags: Array.isArray(editingBlog.tags) ? editingBlog.tags : [],
            country_id: editingBlog.country_id || '',
            state_id: editingBlog.state_id || '',
            city_id: editingBlog.city_id || '',
            course_id: editingBlog.course_id || '',
            subject_id: editingBlog.subject_id || '',
            priority: editingBlog.priority || 'medium',
            is_featured: Boolean(editingBlog.is_featured),
            skills: Array.isArray(editingBlog.skills) ? editingBlog.skills : [],
            publish_date: editingBlog.publish_date ? (typeof editingBlog.publish_date === 'string' ? editingBlog.publish_date.split('T')[0] : editingBlog.publish_date) : '',
            is_active: editingBlog.is_active !== undefined ? Boolean(editingBlog.is_active) : true,
            image: editingBlog.image || ''
          } : undefined}
          errors={errors}
          onSubmit={handleSubmit}
          layout="grid"
          modalSize="5xl"
          columns={3}
          mode={modalMode}
          customValidator={validateBlogForm}
          loading={isSubmitting}
        />

        {/* Image Preview Modal */}
        <Dialog open={showImageModal} onOpenChange={(open) => {
          setShowImageModal(open);
          if (!open) {
            setSelectedImage(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedImage?.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowImageModal(false);
                    setSelectedImage(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-2">
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/800x600?text=Image+Not+Found';
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setDeleteTarget(null);
          }}
          onConfirm={confirmDelete}
          title={deleteTarget?.type === 'bulk' ? 'Delete Multiple Blogs' : 'Delete Blog'}
          description={
            deleteTarget?.type === 'bulk'
              ? `Are you sure you want to delete ${deleteTarget.ids?.length} blogs? This action cannot be undone.`
              : 'Are you sure you want to delete this blog? This action cannot be undone.'
          }
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </AppLayout>
  );
}