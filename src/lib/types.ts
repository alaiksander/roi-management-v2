
export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  totalRevenue: number;
  campaigns: string[]; // IDs of campaigns
};

export type Campaign = {
  id: string;
  clientId: string;
  name: string;
  platform: string;
  startDate: string;
  endDate: string | null;
  budget: number;
  spent: number;
  revenue: number;
  status: 'active' | 'completed' | 'paused';
};

export type Transaction = {
  id: string;
  clientId: string;
  campaignId: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
};

export type Report = {
  id: string;
  name: string;
  dateGenerated: string;
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    clients?: string[];
    campaigns?: string[];
    transactionTypes?: ('income' | 'expense')[];
    categories?: string[];
  };
  summary: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    roi: number;
  };
};

export type ReportFilter = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  clients: string[];
  campaigns: string[];
  transactionTypes: ('income' | 'expense')[];
  categories: string[];
};

export type ChartData = {
  name: string;
  value: number;
};

export type TimeSeriesData = {
  date: string;
  income: number;
  expense: number;
};
