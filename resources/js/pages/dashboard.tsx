import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Total Blogs</h3>
                        <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Published</h3>
                        <p className="text-3xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Draft</h3>
                        <p className="text-3xl font-bold text-yellow-600">0</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Welcome to Blog Management</h2>
                    <p className="text-gray-600">Start creating and managing your blog posts.</p>
                </div>
            </div>
        </AppLayout>
    );
}
