
import React, { useState } from "react";
import { useLanguage, UI_TEXT } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus, Eye, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const CalendarPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch transactions for calendar view
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['calendar-transactions', user?.id, currentMonth],
    queryFn: async () => {
      if (!user?.id) return [];
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const { data, error } = await supabase
        .from('Transaction')
        .select('*, Client!Transaction_clientId_fkey(name), Campaign(name)')
        .eq('userId', user.id)
        .gte('date', monthStart.toISOString())
        .lte('date', monthEnd.toISOString())
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch campaigns for upcoming deadlines
  const { data: campaigns = [] } = useQuery({
    queryKey: ['calendar-campaigns', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('Campaign')
        .select('*, Client!Campaign_clientId_fkey(name)')
        .eq('userId', user.id)
        .eq('status', 'active')
        .order('endDate', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Get transactions for selected date
  const selectedDateTransactions = transactions.filter(transaction =>
    isSameDay(parseISO(transaction.date), selectedDate)
  );

  // Get dates with transactions for calendar highlighting
  const datesWithTransactions = transactions.map(transaction => 
    parseISO(transaction.date)
  );

  // Calculate daily totals for the month
  const dailyTotals = transactions.reduce((acc: Record<string, { income: number; expense: number }>, transaction) => {
    const dateKey = format(parseISO(transaction.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = { income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[dateKey].income += transaction.amount;
    } else {
      acc[dateKey].expense += transaction.amount;
    }
    
    return acc;
  }, {});

  // Get upcoming campaign deadlines (next 30 days)
  const upcomingDeadlines = campaigns.filter(campaign => {
    const endDate = parseISO(campaign.endDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    return endDate >= now && endDate <= thirtyDaysFromNow;
  });

  // Monthly summary
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyProfit = monthlyIncome - monthlyExpense;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kalender</h1>
            <p className="text-muted-foreground">Lihat transaksi dan jadwal kampanye Anda</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kalender</h1>
          <p className="text-muted-foreground">Lihat transaksi dan jadwal kampanye Anda</p>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(monthlyExpense)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keuntungan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(monthlyProfit)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Kalender Transaksi</CardTitle>
            <CardDescription>
              Klik tanggal untuk melihat detail transaksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              onMonthChange={setCurrentMonth}
              className="rounded-md border"
              modifiers={{
                hasTransactions: datesWithTransactions,
              }}
              modifiersStyles={{
                hasTransactions: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                },
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <span>Ada transaksi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi {format(selectedDate, 'dd MMMM yyyy')}</CardTitle>
            <CardDescription>
              {selectedDateTransactions.length} transaksi ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateTransactions.length > 0 ? (
              <div className="space-y-4">
                {selectedDateTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.Client?.name} • {transaction.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Tidak ada transaksi pada tanggal ini
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Deadline Kampanye Mendatang</CardTitle>
            <CardDescription>Kampanye yang akan berakhir dalam 30 hari ke depan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.Client?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatDate(campaign.endDate)}</div>
                    <Badge variant="outline">
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;
