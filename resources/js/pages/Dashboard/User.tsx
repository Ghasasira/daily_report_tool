import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import reportsRoute from '@/routes/reports';
import type { BreadcrumbItem } from '@/types';
import { Calendar, FileText, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface UserDashboardProps {
    todaysReport: {
        id: number;
        report_date: string;
        email_status: string;
        tasks_completed: string;
    } | null;
    hasSubmittedToday: boolean;
    recentReports: Array<{
        id: number;
        report_date: string;
        email_status: string;
        tasks_completed: string[];
    }>;
    team: {
        id: number;
        name: string;
        description: string;
    } | null;
    stats: {
        total_reports: number;
        this_week_reports: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function UserDashboard({ todaysReport, hasSubmittedToday, recentReports, team, stats }: UserDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
                        <p className="text-muted-foreground">
                            Here's your daily report overview
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={reportsRoute.create.url()}>
                                {hasSubmittedToday ? 'Update Today\'s Report' : 'Submit Daily Report'}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Today's Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Today's Report Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasSubmittedToday ? (
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="font-medium text-green-700 dark:text-green-400">
                                        Report Submitted
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Your daily report has been submitted successfully
                                    </p>
                                </div>
                            </div>
                        ) : todaysReport?.email_status === 'draft' ? (
                            <div className="flex items-center gap-3">
                                <Clock className="h-8 w-8 text-yellow-500" />
                                <div>
                                    <p className="font-medium text-yellow-700 dark:text-yellow-400">
                                        Draft Saved
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        You have a draft report that needs to be submitted
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Clock className="h-8 w-8 text-red-500" />
                                <div>
                                    <p className="font-medium text-red-700 dark:text-red-400">
                                        Report Pending
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Don't forget to submit your daily report
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_reports}</div>
                            <p className="text-xs text-muted-foreground">
                                All time submissions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.this_week_reports}</div>
                            <p className="text-xs text-muted-foreground">
                                Reports this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{team?.name || 'No Team'}</div>
                            <p className="text-xs text-muted-foreground">
                                {team?.description || 'Not assigned to a team'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Reports */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Reports</CardTitle>
                        <CardDescription>
                            Your reports from the past week
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentReports.length > 0 ? (
                            <div className="space-y-4">
                                {recentReports.map((report) => (
                                    <div key={report.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{report.report_date}</p>
                                                <Badge variant={report.email_status === 'sent' ? 'default' : report.email_status === 'pending' ? 'secondary' : 'outline'}>
                                                    {report.email_status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {report.tasks_completed.length > 0
                                                    ? `${report.tasks_completed.length} task${report.tasks_completed.length === 1 ? '' : 's'} completed`
                                                    : 'No tasks completed'}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
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
            </div>
        </AppLayout>
    );
}