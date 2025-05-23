
import React from "react";
import { 
  BarChart3, 
  Users, 
  Briefcase,
  FileText,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { mockClients, mockCampaigns, mockTransactions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

// Calculate summary data
const totalRevenue = mockCampaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
const totalSpent = mockCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
const totalROI = (totalRevenue - totalSpent) / totalSpent;
const avgROI = totalROI * 100;

// Prepare chart data
const revenueByClient = mockClients.map((client) => ({
  name: client.name,
  revenue: client.totalRevenue,
}));

const campaignPerformance = mockCampaigns
  .map((campaign) => ({
    name: campaign.name,
    revenue: campaign.revenue,
    spent: campaign.spent,
    roi: ((campaign.revenue - campaign.spent) / campaign.spent) * 100,
  }))
  .sort((a, b) => b.roi - a.roi)
  .slice(0, 5);

// Pie chart data
const roiData = mockCampaigns.map((campaign) => ({
  name: campaign.name,
  value: campaign.revenue - campaign.spent,
}));

const COLORS = [
  "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", 
  "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('id-ID')}</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description="From all campaigns"
          icon={<BarChart3 className="h-4 w-4" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Total Clients"
          value={mockClients.length}
          description="Active clients"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Campaigns"
          value={mockCampaigns.filter((c) => c.status === "active").length}
          description="Of total campaigns"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <MetricCard
          title="Average ROI"
          value={`${avgROI.toFixed(2)}%`}
          description="Across all campaigns"
          icon={<ArrowUp className="h-4 w-4" />}
          trend={{ value: 8.2, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 card-hover">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={campaignPerformance}
                margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(value)
                  } 
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: "#111", fontWeight: "bold" }}
                />
                <Legend />
                <Bar
                  name="Revenue"
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Ad Spend"
                  dataKey="spent"
                  fill="#c4b5fd"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 card-hover">
          <CardHeader>
            <CardTitle>Campaign ROI Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roiData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roiData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTransactions.slice(-5).reverse().map((transaction) => {
                const client = mockClients.find((c) => c.id === transaction.clientId);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "income" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                        {transaction.type === "income" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{client?.name}</p>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Top Clients By Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockClients
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 5)
                .map((client, index) => (
                  <div key={client.id} className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{client.company}</p>
                    </div>
                    <p className="text-sm font-medium tabular-nums">
                      {formatCurrency(client.totalRevenue)}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
