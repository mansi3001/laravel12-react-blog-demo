import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, FileText, Shield, Key } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (userPermissions: string[]): NavItem[] => {
    const allItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
            permission: null // Dashboard always visible
        },
        {
            title: 'Slider',
            href: '/slider',
            icon: LayoutGrid,
            permission: null // Always visible
        },
        {
            title: 'Blogs',
            href: '/blogs',
            icon: FileText,
            permission: 'blogs.view'
        },
        {
            title: 'Roles',
            href: '/roles',
            icon: Shield,
            permission: 'roles.view'
        },
        {
            title: 'Permissions',
            href: '/permissions',
            icon: Key,
            permission: 'permissions.view'
        },
        {
            title: 'Dynamic Dependancy',
            href: '/location-form',
            icon: Key,
            permission: null
        },
    ];

    return allItems.filter(item => 
        !item.permission || userPermissions.includes(item.permission)
    );
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userPermissions = auth?.user?.permissions || [];
    const mainNavItems = getMainNavItems(userPermissions);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;


