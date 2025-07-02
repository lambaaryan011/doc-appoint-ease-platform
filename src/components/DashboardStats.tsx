import { Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats as StatsType } from "@/types";

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Completed Today",
      value: stats.completedAppointments,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Today's Schedule",
      value: stats.todayAppointments,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="medical-card animate-card-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};