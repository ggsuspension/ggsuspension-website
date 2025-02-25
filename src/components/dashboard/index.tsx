import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart4,
  Users,
  Wallet,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      icon: <Users className="h-4 w-4" />,
      trend: 12.5,
    },
    {
      title: "Revenue",
      value: "$45,234",
      icon: <Wallet className="h-4 w-4" />,
      trend: 8.2,
    },
    {
      title: "Conversions",
      value: "1,234",
      icon: <BarChart4 className="h-4 w-4" />,
      trend: -3.1,
    },
    {
      title: "Support Tickets",
      value: "56",
      icon: <Package className="h-4 w-4" />,
      trend: 2.4,
    },
  ];

  const recentOrders = [
    { id: "#1234", customer: "John Doe", amount: "$250", status: "Delivered" },
    {
      id: "#1235",
      customer: "Jane Smith",
      amount: "$150",
      status: "Processing",
    },
    { id: "#1236", customer: "Bob Johnson", amount: "$499", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center pt-2 text-xs text-muted-foreground">
                <ArrowUpRight
                  className={`h-3 w-3 ${
                    stat.trend > 0 ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`ml-1 ${
                    stat.trend > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend}%
                </span>
                <span className="ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Main Chart */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center hover:bg-muted/50 p-2 rounded"
              >
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{order.status}</Badge>
                  <span className="text-sm font-medium">{order.amount}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects Progress */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{project.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


const projects = [
  { id: 1, name: "Website Redesign", progress: 65 },
  { id: 2, name: "Mobile App Development", progress: 40 },
  { id: 3, name: "Marketing Campaign", progress: 85 },
];
