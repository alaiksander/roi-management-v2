
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Campaign, Transaction, ReportFilter, TimeSeriesData, ChartData } from "./types";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'dd MMM yyyy');
};

export const calculateROI = (revenue: number, cost: number): number => {
  if (cost === 0) return 0;
  return (revenue - cost) / cost;
};

export const formatROI = (roi: number): string => {
  return `${(roi * 100).toFixed(2)}%`;
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTransactionTypeColor = (type: string): string => {
  return type === 'income' ? 'text-green-600' : 'text-red-600';
};

export const filterTransactions = (
  transactions: Transaction[],
  filters: ReportFilter
): Transaction[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    
    // Date filter
    if (filters.startDate && transactionDate < filters.startDate) return false;
    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (transactionDate > endOfDay) return false;
    }
    
    // Client filter
    if (filters.clients.length > 0 && !filters.clients.includes(transaction.clientId)) return false;
    
    // Campaign filter
    if (filters.campaigns.length > 0 && !filters.campaigns.includes(transaction.campaignId)) return false;
    
    // Transaction type filter
    if (
      filters.transactionTypes.length > 0 && 
      !filters.transactionTypes.includes(transaction.type)
    ) return false;
    
    // Category filter
    if (
      filters.categories.length > 0 && 
      !filters.categories.includes(transaction.category)
    ) return false;
    
    return true;
  });
};

export const generateTimeSeriesData = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): TimeSeriesData[] => {
  const data: { [key: string]: { income: number; expense: number } } = {};
  
  // Create dates between start and end
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    data[dateKey] = { income: 0, expense: 0 };
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Fill with transaction data
  transactions.forEach((tx) => {
    const dateKey = tx.date;
    if (data[dateKey]) {
      if (tx.type === 'income') {
        data[dateKey].income += tx.amount;
      } else {
        data[dateKey].expense += tx.amount;
      }
    }
  });
  
  // Convert to array format
  return Object.entries(data).map(([date, values]) => ({
    date,
    income: values.income,
    expense: values.expense
  }));
};

export const generatePieChartData = (
  campaigns: Campaign[]
): ChartData[] => {
  return campaigns.map((campaign) => ({
    name: campaign.name,
    value: calculateROI(campaign.revenue, campaign.spent)
  }));
};

export const downloadCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  // Get headers
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV string
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header]?.toString() || '';
        // Escape commas and quotes
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getFirstAndLastTransactionDates = (transactions: Transaction[]): { firstDate: Date, lastDate: Date } => {
  if (transactions.length === 0) {
    return { 
      firstDate: new Date(), 
      lastDate: new Date() 
    };
  }
  
  const dates = transactions.map(tx => new Date(tx.date));
  return {
    firstDate: new Date(Math.min(...dates.map(d => d.getTime()))),
    lastDate: new Date(Math.max(...dates.map(d => d.getTime())))
  };
};
