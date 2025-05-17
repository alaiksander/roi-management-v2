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
import { id } from "date-fns/locale";
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
  const [savedReports, setSavedReports] = useState(mockReports);
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [amount, setAmount] = useState("");
  const { firstDate, lastDate } = getFirstAndLastTransactionDates(mockTransactions);
  const handleDeleteReport = (idx: number) => {
    setSavedReports((prev) => prev.filter((_, i) => i !== idx));
  };
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
        Tanggal: format(new Date(tx.date), "yyyy-MM-dd"),
        Tipe: tx.type,
        Jumlah: tx.amount,
        Klien: client?.name || "Tidak diketahui",
        Kampanye: campaign?.name || "Tidak diketahui",
        Kategori: tx.category,
        Deskripsi: tx.description,
      };
    });
    
    downloadCSV(reportData, `report-${format(new Date(), "yyyy-MM-dd")}`);
  };
  
  const handleCreateReport = () => {
    if (!newReportName.trim()) {
      if (window && window.alert) {
        window.alert("Nama laporan tidak boleh kosong!");
      }
      return;
    }
    if (newReportName.length > MAX_REPORT_NAME_LENGTH) {
      if (window && window.alert) {
        window.alert(`Nama laporan maksimal ${MAX_REPORT_NAME_LENGTH} karakter.`);
      }
      return;
    }
    if (FORBIDDEN_CHARS_REGEX.test(newReportName)) {
      if (window && window.alert) {
        window.alert("Nama laporan tidak boleh mengandung karakter khusus: / \\ : * ? \" < > |");
      }
      return;
    }
    if (savedReports.some(
      (report) => report.name.trim().toLowerCase() === newReportName.trim().toLowerCase()
    )) {
      if (window && window.alert) {
        window.alert("Nama laporan sudah ada. Gunakan nama lain.");
      }
      return;
    }
    if (!filters.startDate || !filters.endDate) {
      if (window && window.alert) {
        window.alert("Tanggal mulai dan tanggal akhir harus diisi.");
      }
      return;
    }
    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      if (window && window.alert) {
        window.alert("Tanggal mulai tidak boleh setelah tanggal akhir.");
      }
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      if (window && window.alert) {
        window.alert("Jumlah harus berupa angka positif.");
      }
      return;
    }
    // Buat laporan baru dan tambahkan ke daftar laporan tersimpan
    const newReport = {
      id: `laporan-${Date.now()}`,
      name: newReportName,
      dateRange: {
        start: filters.startDate ? filters.startDate.toISOString().slice(0, 10) : "",
        end: filters.endDate ? filters.endDate.toISOString().slice(0, 10) : "",
      },
      summary: {
        totalIncome,
        totalExpense: totalExpenses,
        netProfit,
        roi,
      },
      dateGenerated: new Date().toISOString(),
      filters: { ...filters },
    };
    setSavedReports((prev) => [newReport, ...prev]);
    setIsNewReportDialogOpen(false);
    setNewReportName("");
    setSelectedReportTab("saved");
    // Optional: Show toast or alert in Bahasa Indonesia
    if (window && window.alert) {
      window.alert(`Laporan "${newReportName}" berhasil disimpan!`);
    }
  };

  // Check if the new report name already exists (case-insensitive, trimmed)
  const isDuplicateName = savedReports.some(
    (report) => report.name.trim().toLowerCase() === newReportName.trim().toLowerCase()
  );

  // Add a constant for max length
  const MAX_REPORT_NAME_LENGTH = 50;

  // Add a regex for forbidden characters in file names
  const FORBIDDEN_CHARS_REGEX = /[\/\\:\*\?"<>\|]/;

  // Helper to check for forbidden characters
  const hasForbiddenChars = FORBIDDEN_CHARS_REGEX.test(newReportName);

  // Helper to check if start date is after end date
  const isInvalidDateRange =
    filters.startDate && filters.endDate
      ? new Date(filters.startDate) > new Date(filters.endDate)
      : false;

  // Helper to check if date fields are empty
  const isDateFieldEmpty = !filters.startDate || !filters.endDate;

  // Helper to check if amount is a positive number
  const isAmountInvalid = !amount || isNaN(Number(amount)) || Number(amount) <= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground">
            Buat dan analisis laporan keuangan
          </p>
        </div>
        <Button onClick={() => setIsNewReportDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Laporan Baru
        </Button>
      </div>

      <Tabs defaultValue={selectedReportTab} onValueChange={setSelectedReportTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">Laporan Tersimpan</TabsTrigger>
          <TabsTrigger value="custom">Laporan Kustom</TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedReports.map((report, idx) => (
              <Card key={report.id} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {report.name}
                    </CardTitle>
                    <div className="flex gap-2">
  <Button
    size="sm"
    variant="outline"
    className="h-8 w-8 p-0"
    title="Unduh Laporan"
    onClick={() => handleDownloadReport(report)}
  >
    <Download className="h-4 w-4" />
  </Button>
  <Button
    size="sm"
    variant="destructive"
    className="h-8 w-8 p-0"
    title="Hapus Laporan"
    onClick={() => handleDeleteReport(idx)}
  >
    <span className="sr-only">Hapus</span>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  </Button>
</div>
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
                      <p className="text-xs text-muted-foreground">Total Pemasukan</p>
                      <p className="text-sm font-medium text-green-600">{formatCurrency(report.summary.totalIncome)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
                      <p className="text-sm font-medium text-red-600">{formatCurrency(report.summary.totalExpense)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Keuntungan Bersih</p>
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
              <CardTitle className="text-lg">Filter Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? (
                           format(filters.startDate, "PPP", { locale: id })
                         ) : (
                           <span>Pilih tanggal</span>
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
                  <Label htmlFor="endDate">Tanggal Akhir</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? (
                           format(filters.endDate, "PPP", { locale: id })
                         ) : (
                           <span>Pilih tanggal</span>
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
                  <Label htmlFor="clients">Klien</Label>
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
                      <SelectValue placeholder="Semua Klien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Klien</SelectItem>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionTypes">Tipe Transaksi</Label>
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
                      <SelectValue placeholder="Semua Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="income">Hanya Pemasukan</SelectItem>
                      <SelectItem value="expense">Hanya Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Keuntungan Bersih</CardTitle>
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
                Pemasukan dan Pengeluaran dari Waktu ke Waktu
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
                      tickFormatter={(date) => format(new Date(date), "dd MMM", { locale: id })}
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
                      name="Pemasukan"
                      stroke="#8b5cf6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      name="Pengeluaran"
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
              Ekspor CSV
            </Button>
            <Button onClick={() => setIsNewReportDialogOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Simpan Laporan
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isNewReportDialogOpen} onOpenChange={setIsNewReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Laporan Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Nama Laporan</Label>
              <Input
                id="reportName"
                value={newReportName}
                onChange={(e) => setNewReportName(e.target.value)}
                placeholder="Kinerja Q1 2025"
                maxLength={MAX_REPORT_NAME_LENGTH}
              />
            </div>
            <div className="space-y-2">
              <Label>Rentang Tanggal</Label>
              <div className="text-sm">
                {filters.startDate ? format(filters.startDate, "PPP", { locale: id }) : "Tanggal mulai"} -{' '}
                {filters.endDate ? format(filters.endDate, "PPP", { locale: id }) : "Tanggal akhir"}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Ringkasan Laporan</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Pemasukan:</span>{" "}
                  {formatCurrency(totalIncome)}
                </div>
                <div>
                  <span className="text-muted-foreground">Pengeluaran:</span>{" "}
                  {formatCurrency(totalExpenses)}
                </div>
                <div>
                  <span className="text-muted-foreground">Keuntungan Bersih:</span>{" "}
                  {formatCurrency(netProfit)}
                </div>
                <div>
                  <span className="text-muted-foreground">ROI:</span>{" "}
                  {(roi * 100).toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                min={0}
                step="any"
                value={amount}
                onChange={(e) => {
                  // Only allow numeric input and prevent negative values
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) {
                    setAmount(val);
                  }
                }}
                placeholder="Jumlah (hanya angka positif)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewReportDialogOpen(false)}
            >
              Batal
            </Button>
            <Button 
              onClick={handleCreateReport}
              disabled={
                !newReportName.trim() ||
                isDuplicateName ||
                newReportName.length > MAX_REPORT_NAME_LENGTH ||
                hasForbiddenChars ||
                isInvalidDateRange ||
                isDateFieldEmpty ||
                isAmountInvalid
              }
            >
              Simpan Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Download report as CSV
function handleDownloadReport(report: any) {
  const data = [
    {
      Nama: report.name,
      'Tanggal Mulai': formatDate(report.dateRange.start),
      'Tanggal Akhir': formatDate(report.dateRange.end),
      'Total Pemasukan': report.summary.totalIncome,
      'Total Pengeluaran': report.summary.totalExpense,
      'Keuntungan Bersih': report.summary.netProfit,
      ROI: (report.summary.roi * 100).toFixed(2) + '%',
    },
  ];
  downloadCSV(data, `laporan-${report.name}.csv`);
}

// Delete report from savedReports
function handleDeleteReport(idx: number) {
  setSavedReports((prev) => prev.filter((_, i) => i !== idx));
}

export default ReportsPage;
function setSavedReports(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}

