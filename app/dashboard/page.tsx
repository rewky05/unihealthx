"use client";

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

const stats = [
  {
    title: "Total Doctors",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Verified Doctors",
    value: "231",
    change: "+5%",
    trend: "up",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Pending Verification",
    value: "16",
    change: "-3%",
    trend: "down",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Avg Rating",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    icon: TrendingUp,
    color: "text-indigo-600",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Doctor verified",
    user: "Dr. Maria Santos",
    time: "5 minutes ago",
    type: "success",
    icon: CheckCircle,
  },
  {
    id: 2,
    action: "New feedback received",
    user: "Patient review for Dr. Juan Dela Cruz",
    time: "12 minutes ago",
    type: "info",
    icon: MessageSquare,
  },
  {
    id: 3,
    action: "Document uploaded",
    user: "Dr. Ana Rodriguez - PRC License",
    time: "1 hour ago",
    type: "info",
    icon: Activity,
  },
  {
    id: 4,
    action: "Schedule updated",
    user: "Dr. Carlos Mendoza - Cardiology",
    time: "2 hours ago",
    type: "info",
    icon: Calendar,
  },
  {
    id: 5,
    action: "Verification required",
    user: "Dr. Elena Reyes - Missing PRC",
    time: "3 hours ago",
    type: "warning",
    icon: AlertTriangle,
  },
];

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
              <Button className="h-20 flex-col space-y-2">
                <UserCheck className="h-6 w-6" />
                <span>Verify Doctor</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Add Doctor</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Manage Schedules</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span>Review Feedback</span>
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
                {recentActivity.map((activity) => (
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
