import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { props } = usePage();
    const { showToast } = useToast();
    const flash = props.flash as any;

    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        }
        if (flash?.error) {
            showToast(flash.error, 'error');
        }
    }, [flash]);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
