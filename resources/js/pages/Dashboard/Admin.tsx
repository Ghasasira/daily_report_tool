import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import teamRoute from '@/routes/teams';
import usersRoute from '@/routes/users';
import reportsRoute from '@/routes/reports';
import type { BreadcrumbItem } from '@/types';
import { Users, LayoutGrid, FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_users: number;
        total_teams: number;
        total_reports_today: number;
        total_reports_this_week: number;
        pending_reports_today: number;
    };
    recentReports: Array<{
        id: number;
        report_date: string;
        user: {
            name: string;
            email: string;
        };
        team: {
            name: string;
        } | null;
        email_status: string;
        tasks_completed: string[];
    }>;
    teams: Array<{
        id: number;
        name: string;
        members_count: number;
        primary_supervisor: {
            name: string;
        } | null;
    }>;
    isAdmin: boolean;
    isSupervisor: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
    },
];

export default function AdminDashboard({ stats, recentReports, teams, isAdmin, isSupervisor }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Overview of your daily report system
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && (
                            <>
                                <Button variant="outline" asChild>
                                    <Link href={teamRoute.index.url()}>
                                        Manage Teams
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={usersRoute.index.url()}>
                                        Manage Users
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_teams}</div>
                            <p className="text-xs text-muted-foreground">
                                Active teams
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_reports_today}</div>
                            <p className="text-xs text-muted-foreground">
                                Submitted today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_reports_this_week}</div>
                            <p className="text-xs text-muted-foreground">
                                Reports this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Today</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_reports_today}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting processing
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Reports */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reports</CardTitle>
                            <CardDescription>
                                Latest report submissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentReports.length > 0 ? (
                                <div className="space-y-4">
                                    {recentReports.map((report) => (
                                        <div key={report.id} className="flex items-start justify-between border-b pb-4 last:border-b-0">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium truncate">{report.user.name}</p>
                                                    <Badge variant={report.email_status === 'sent' ? 'default' : report.email_status === 'pending' ? 'secondary' : 'outline'}>
                                                        {report.email_status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {report.report_date} • {report.team?.name || 'No Team'}
                                                </p>
                                                <p className="text-sm mt-1">
                                                    {report.tasks_completed.length} task{report.tasks_completed.length === 1 ? '' : 's'} completed
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild className="ml-2 flex-shrink-0">
                                                <Link href={reportsRoute.show.url(report.id)}>
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No recent reports found.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Teams Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Teams Overview</CardTitle>
                            <CardDescription>
                                Your teams and their supervisors
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {teams.length > 0 ? (
                                <div className="space-y-4">
                                    {teams.map((team) => (
                                        <div key={team.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                            <div className="flex-1">
                                                <p className="font-medium">{team.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {team.members_count} members • Supervisor: {team.primary_supervisor?.name || 'None'}
                                                </p>
                                            </div>
                                            {isAdmin && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={teamRoute.show.url(team.id)}>
                                                        View
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No teams found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}