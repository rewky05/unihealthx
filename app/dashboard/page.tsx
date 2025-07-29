"use client";

import Link from "next/link";
import { useRealDashboard } from "@/hooks/useRealData";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Real-time Firebase data from your database
const { dashboardData, recentActivity, loading: dashboardLoading, error: dashboardError } = useRealDashboard();

// Dynamic stats from Firebase
const stats = dashboardData ? [
  {
    title: "Total Doctors",
    value: dashboardData.totalDoctors.toString(),
    change: "+12%", // TODO: Calculate from historical data
    trend: "up" as const,
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Verified Doctors", 
    value: dashboardData.verifiedDoctors.toString(),
    change: "+5%",
    trend: "up" as const,
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Pending Verification",
    value: dashboardData.pendingVerification.toString(),
    change: "-3%",
    trend: "down" as const,
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Avg Rating",
    value: dashboardData.averageRating.toFixed(1),
    change: "+0.2",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-indigo-600",
  },
] : [];

// Real-time activity from your Firebase database
const activityList = recentActivity.map(activity => ({
  id: activity.id,
  action: activity.action,
  user: activity.user,
  time: new Date(activity.timestamp).toLocaleString(),
  type: activity.type === 'feedback' ? 'success' : 
        activity.type === 'appointment' ? 'info' : 
        activity.type === 'referral' ? 'warning' : 'info',
  icon: activity.type === 'feedback' ? MessageSquare :
        activity.type === 'appointment' ? Calendar :
        activity.type === 'referral' ? Users : Activity,
}));

const pendingTasks = [
  {
    id: 1,
    title: "Review Dr. Santos credentials",
    description: "PRC license and board certification pending review",
    priority: "high",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Process clinic affiliation",
    description: "Metro Manila Hospital - 3 doctors pending approval",
    priority: "medium",
    dueDate: "Tomorrow",
  },
];

export default function DashboardPage() {
  // Show loading state
  if (dashboardLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (dashboardError) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading dashboard</p>
            </div>
            <p className="text-sm text-muted-foreground">{dashboardError}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div
                  className={`text-xs flex items-center mt-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp
                    className={`h-3 w-3 mr-1 ${
                      stat.trend === "down" ? "rotate-180" : ""
                    }`}
                  />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* <Button className="h-20 flex-col space-y-2"> */}
              <Button className="h-20 flex-col space-y-2">
                <Link
                  href="/doctors?status=pending"
                  className="flex flex-col items-center space-y-2"
                >
                  <UserCheck className="h-6 w-6" />
                  <span>Verify Doctor</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20">
                <Link
                  href="/doctors/add"
                  className="flex flex-col items-center space-y-2"
                >
                  <Users className="h-6 w-6" />
                  <span>Add Doctor</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Manage Schedules</span>
              </Button>
              <Button variant="outline" className="h-20">
                <Link
                  href="/feedback#review-feedback"
                  className="flex flex-col items-center space-y-2"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Review Feedback</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest administrative actions and system updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityList.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`rounded-full p-1 ${
                        activity.type === "success"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : activity.type === "warning"
                          ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                      }`}
                    >
                      <activity.icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Pending Tasks
              </CardTitle>
              <CardDescription>
                Items requiring administrative attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.dueDate}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
