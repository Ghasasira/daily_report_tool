import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import reports from '@/routes/reports';
import teams from '@/routes/teams';
import users from '@/routes/users';
import type { NavItem } from '@/types';
import { dashboard } from '@/routes';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Team',
        href: teams.index.url(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: users.index.url(),
        icon: LayoutGrid,
    },
    {
        title: 'Reports',
        href: reports.index.url(),
        icon: LayoutGrid,
    }
];

const generalUserNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Reports',
        href: reports.index.url(),
        icon: LayoutGrid,
    }
];


export function AppSidebar() {
    const { auth } = usePage().props;
    const isGeneralUser = auth.user.role === 'general';
    const navItems = isGeneralUser ? generalUserNavItems : adminNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
