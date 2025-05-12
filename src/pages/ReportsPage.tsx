
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockClients,
  mockCampaigns,
  mockTransactions,
  mockReports,
} from "@/lib/mock-data";
import {
  formatCurrency,
  formatDate,
  filterTransactions,
  generateTimeSeriesData,
  downloadCSV,
  getFirstAndLastTransactionDates,
} from "@/lib/utils";
import {
  FileText,
  Download,
  CalendarIcon,
  Plus,
  BarChart3,
  FileSpreadsheet,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ReportFilter } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ReportsPage = () => {
  const [selectedReportTab, setSelectedReportTab] = useState("saved");
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const { firstDate, lastDate } = getFirstAndLastTransactionDates(mockTransactions);
  
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: firstDate,
    endDate: lastDate,
    clients: [],
    campaigns: [],
    transactionTypes: [],
    categories: [],
  });

  // Get filtered transactions based on the current filters
  const filteredTransactions = filterTransactions(mockTransactions, filters);
  
  // Calculate summary data
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const netProfit = totalIncome - totalExpenses;
  
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) : 0;

  // Generate time series data for charts
  const timeSeriesData = generateTimeSeriesData(
    filteredTransactions,
    filters.startDate || firstDate,
    filters.endDate || lastDate
  );

  // Export report data
  const exportReport = () => {
    const reportData = filteredTransactions.map((tx) => {
      const client = mockClients.find((c) => c.id === tx.clientId);
      const campaign = mockCampaigns.find((c) => c.id === tx.campaignId);
      
      return {
        Date: format(new Date(tx.date), "yyyy-MM-dd"),
        Type: tx.type,
        Amount: tx.amount,
        Client: client?.name || "Unknown",
        Campaign: campaign?.name || "Unknown",
        Category: tx.category,
        Description: tx.description,
      };
    });
    
    downloadCSV(reportData, `report-${format(new Date(), "yyyy-MM-dd")}`);
  };
  
  const handleCreateReport = () => {
    // In a real app, this would create a new report and save it
    alert(`Report "${newReportName}" has been created!`);
    setIsNewReportDialogOpen(false);
    setNewReportName("");
    setSelectedReportTab("saved");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and analyze financial reports
          </p>
        </div>
        <Button onClick={() => setIsNewReportDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Report
        </Button>
      </div>

      <Tabs defaultValue={selectedReportTab} onValueChange={setSelectedReportTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Report</TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockReports.map((report) => (
              <Card key={report.id} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {report.name}
                    </CardTitle>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Income</p>
                      <p className="text-sm font-medium text-green-600">{formatCurrency(report.summary.totalIncome)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Expenses</p>
                      <p className="text-sm font-medium text-red-600">{formatCurrency(report.summary.totalExpense)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Net Profit</p>
                      <p className="text-sm font-medium">{formatCurrency(report.summary.netProfit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="text-sm font-medium">
                        {(report.summary.roi * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="custom" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? (
                          format(filters.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) =>
                          setFilters({ ...filters, startDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? (
                          format(filters.endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) =>
                          setFilters({ ...filters, endDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clients">Clients</Label>
                  <Select
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        clients:
                          value === "all" ? [] : [value],
                      })
                    }
                  >
                    <SelectTrigger id="clients">
                      <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionTypes">Transaction Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        transactionTypes:
                          value === "all"
                            ? []
                            : [value as "income" | "expense"],
                      })
                    }
                  >
                    <SelectTrigger id="transactionTypes">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income Only</SelectItem>
                      <SelectItem value="expense">Expenses Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(netProfit)}
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(roi * 100).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Income and Expenses Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSeriesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), "dd MMM")}
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
                      labelFormatter={(label) => format(new Date(label), "dd MMM yyyy")}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#8b5cf6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      name="Expenses"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => exportReport()}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setIsNewReportDialogOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Save Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isNewReportDialogOpen} onOpenChange={setIsNewReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={newReportName}
                onChange={(e) => setNewReportName(e.target.value)}
                placeholder="Q1 2025 Performance"
              />
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="text-sm">
                {filters.startDate ? format(filters.startDate, "PPP") : "Start date"} -{" "}
                {filters.endDate ? format(filters.endDate, "PPP") : "End date"}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Report Summary</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Income:</span>{" "}
                  {formatCurrency(totalIncome)}
                </div>
                <div>
                  <span className="text-muted-foreground">Expenses:</span>{" "}
                  {formatCurrency(totalExpenses)}
                </div>
                <div>
                  <span className="text-muted-foreground">Net Profit:</span>{" "}
                  {formatCurrency(netProfit)}
                </div>
                <div>
                  <span className="text-muted-foreground">ROI:</span>{" "}
                  {(roi * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateReport} disabled={!newReportName.trim()}>
              Save Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;
