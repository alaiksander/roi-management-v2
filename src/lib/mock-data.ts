
import { Client, Campaign, Transaction, Report } from './types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'PT Sejahtera Media',
    company: 'Sejahtera Media',
    email: 'contact@sejahteramedia.id',
    phone: '+62 812 3456 7890',
    totalRevenue: 125000000,
    campaigns: ['campaign-1', 'campaign-2']
  },
  {
    id: 'client-2',
    name: 'Andika Wijaya',
    company: 'Indofood Indonesia',
    email: 'andika@indofood.id',
    phone: '+62 878 9012 3456',
    totalRevenue: 87500000,
    campaigns: ['campaign-3']
  },
  {
    id: 'client-3',
    name: 'Maya Putri',
    company: 'Tokopedia',
    email: 'maya@tokopedia.com',
    phone: '+62 856 7890 1234',
    totalRevenue: 212000000,
    campaigns: ['campaign-4', 'campaign-5']
  },
  {
    id: 'client-4',
    name: 'Budi Santoso',
    company: 'Gojek',
    email: 'budi@gojek.com',
    phone: '+62 838 9012 3456',
    totalRevenue: 156000000,
    campaigns: ['campaign-6']
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    clientId: 'client-1',
    name: 'Q1 Social Media Campaign',
    platform: 'Instagram & Facebook',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    budget: 25000000,
    spent: 23500000,
    revenue: 75000000,
    status: 'completed'
  },
  {
    id: 'campaign-2',
    clientId: 'client-1',
    name: 'Q2 Product Launch',
    platform: 'Google Ads',
    startDate: '2025-04-01',
    endDate: null,
    budget: 35000000,
    spent: 12500000,
    revenue: 50000000,
    status: 'active'
  },
  {
    id: 'campaign-3',
    clientId: 'client-2',
    name: 'Ramadan Special',
    platform: 'TikTok & Instagram',
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    budget: 45000000,
    spent: 45000000,
    revenue: 87500000,
    status: 'completed'
  },
  {
    id: 'campaign-4',
    clientId: 'client-3',
    name: 'Summer Sale',
    platform: 'Facebook & Google',
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    budget: 75000000,
    spent: 45000000,
    revenue: 125000000,
    status: 'active'
  },
  {
    id: 'campaign-5',
    clientId: 'client-3',
    name: 'Christmas Campaign',
    platform: 'YouTube & Instagram',
    startDate: '2025-11-15',
    endDate: null,
    budget: 60000000,
    spent: 10000000,
    revenue: 87000000,
    status: 'active'
  },
  {
    id: 'campaign-6',
    clientId: 'client-4',
    name: 'App Download Campaign',
    platform: 'Google Ads & App Store',
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    budget: 50000000,
    spent: 48500000,
    revenue: 156000000,
    status: 'completed'
  },
];

export const mockTransactions: Transaction[] = [
  // Client 1 - Campaign 1
  {
    id: 'tx-1',
    clientId: 'client-1',
    campaignId: 'campaign-1',
    date: '2025-01-20',
    amount: 10000000,
    type: 'income',
    category: 'Advance Payment',
    description: 'Initial payment for Q1 campaign'
  },
  {
    id: 'tx-2',
    clientId: 'client-1',
    campaignId: 'campaign-1',
    date: '2025-02-05',
    amount: 8500000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'Facebook & Instagram ads'
  },
  {
    id: 'tx-3',
    clientId: 'client-1',
    campaignId: 'campaign-1',
    date: '2025-03-20',
    amount: 65000000,
    type: 'income',
    category: 'Final Payment',
    description: 'Final payment for Q1 campaign'
  },
  {
    id: 'tx-4',
    clientId: 'client-1',
    campaignId: 'campaign-1',
    date: '2025-03-25',
    amount: 15000000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'Remaining ad spend for Q1'
  },
  
  // Client 1 - Campaign 2
  {
    id: 'tx-5',
    clientId: 'client-1',
    campaignId: 'campaign-2',
    date: '2025-04-01',
    amount: 20000000,
    type: 'income',
    category: 'Advance Payment',
    description: 'Initial payment for product launch'
  },
  {
    id: 'tx-6',
    clientId: 'client-1',
    campaignId: 'campaign-2',
    date: '2025-04-10',
    amount: 12500000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'Google Ads spend'
  },
  {
    id: 'tx-7',
    clientId: 'client-1',
    campaignId: 'campaign-2',
    date: '2025-05-02',
    amount: 30000000,
    type: 'income',
    category: 'Payment',
    description: 'Additional payment for product launch'
  },
  
  // Client 2 - Campaign 3
  {
    id: 'tx-8',
    clientId: 'client-2',
    campaignId: 'campaign-3',
    date: '2025-03-01',
    amount: 25000000,
    type: 'income',
    category: 'Advance Payment',
    description: 'Initial payment for Ramadan campaign'
  },
  {
    id: 'tx-9',
    clientId: 'client-2',
    campaignId: 'campaign-3',
    date: '2025-03-15',
    amount: 20000000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'TikTok ad spend'
  },
  {
    id: 'tx-10',
    clientId: 'client-2',
    campaignId: 'campaign-3',
    date: '2025-04-01',
    amount: 25000000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'Instagram ad spend'
  },
  {
    id: 'tx-11',
    clientId: 'client-2',
    campaignId: 'campaign-3',
    date: '2025-05-10',
    amount: 62500000,
    type: 'income',
    category: 'Final Payment',
    description: 'Final payment for Ramadan campaign'
  },
  
  // Client 3 - Campaign 4
  {
    id: 'tx-12',
    clientId: 'client-3',
    campaignId: 'campaign-4',
    date: '2025-05-01',
    amount: 50000000,
    type: 'income',
    category: 'Advance Payment',
    description: 'Initial payment for Summer Sale'
  },
  {
    id: 'tx-13',
    clientId: 'client-3',
    campaignId: 'campaign-4',
    date: '2025-05-15',
    amount: 25000000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'Facebook ad spend'
  },
  {
    id: 'tx-14',
    clientId: 'client-3',
    campaignId: 'campaign-4',
    date: '2025-06-01',
    amount: 20000000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'Google Ads spend'
  },
  {
    id: 'tx-15',
    clientId: 'client-3',
    campaignId: 'campaign-4',
    date: '2025-06-15',
    amount: 75000000,
    type: 'income',
    category: 'Interim Payment',
    description: 'Second payment for Summer Sale'
  },
  
  // Client 3 - Campaign 5
  {
    id: 'tx-16',
    clientId: 'client-3',
    campaignId: 'campaign-5',
    date: '2025-11-15',
    amount: 30000000,
    type: 'income',
    category: 'Advance Payment',
    description: 'Initial payment for Christmas campaign'
  },
  {
    id: 'tx-17',
    clientId: 'client-3',
    campaignId: 'campaign-5',
    date: '2025-11-20',
    amount: 10000000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'YouTube ad spend'
  },
  {
    id: 'tx-18',
    clientId: 'client-3',
    campaignId: 'campaign-5',
    date: '2025-12-01',
    amount: 57000000,
    type: 'income',
    category: 'Interim Payment',
    description: 'Second payment for Christmas campaign'
  },
  
  // Client 4 - Campaign 6
  {
    id: 'tx-19',
    clientId: 'client-4',
    campaignId: 'campaign-6',
    date: '2025-02-01',
    amount: 25000000,
    type: 'income',
    category: 'Advance Payment',
    description: 'Initial payment for App Download campaign'
  },
  {
    id: 'tx-20',
    clientId: 'client-4',
    campaignId: 'campaign-6',
    date: '2025-02-15',
    amount: 23500000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'Google Ads spend'
  },
  {
    id: 'tx-21',
    clientId: 'client-4',
    campaignId: 'campaign-6',
    date: '2025-03-10',
    amount: 25000000,
    type: 'expense',
    category: 'Ad Spend',
    description: 'App Store promotion'
  },
  {
    id: 'tx-22',
    clientId: 'client-4',
    campaignId: 'campaign-6',
    date: '2025-03-25',
    amount: 56000000,
    type: 'income',
    category: 'Interim Payment',
    description: 'Second payment for App campaign'
  },
  {
    id: 'tx-23',
    clientId: 'client-4',
    campaignId: 'campaign-6',
    date: '2025-05-10',
    amount: 75000000,
    type: 'income',
    category: 'Final Payment',
    description: 'Final payment for App campaign'
  }
];

export const mockReports: Report[] = [
  {
    id: 'report-1',
    name: 'Q1 2025 Performance Review',
    dateGenerated: '2025-04-05',
    dateRange: {
      start: '2025-01-01',
      end: '2025-03-31'
    },
    filters: {
      clients: ['client-1', 'client-2', 'client-4'],
      transactionTypes: ['income', 'expense']
    },
    summary: {
      totalIncome: 247500000,
      totalExpense: 92000000,
      netProfit: 155500000,
      roi: 1.69
    }
  },
  {
    id: 'report-2',
    name: 'Ramadan Campaign Analysis',
    dateGenerated: '2025-05-15',
    dateRange: {
      start: '2025-03-01',
      end: '2025-04-30'
    },
    filters: {
      clients: ['client-2'],
      campaigns: ['campaign-3'],
      transactionTypes: ['income', 'expense']
    },
    summary: {
      totalIncome: 87500000,
      totalExpense: 45000000,
      netProfit: 42500000,
      roi: 0.94
    }
  },
  {
    id: 'report-3',
    name: 'Half Year Review 2025',
    dateGenerated: '2025-07-10',
    dateRange: {
      start: '2025-01-01',
      end: '2025-06-30'
    },
    filters: {
      transactionTypes: ['income', 'expense']
    },
    summary: {
      totalIncome: 548000000,
      totalExpense: 159500000,
      netProfit: 388500000,
      roi: 2.44
    }
  }
];

export const getClientById = (clientId: string): Client | undefined => {
  return mockClients.find(client => client.id === clientId);
};

export const getCampaignById = (campaignId: string): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === campaignId);
};

export const getCampaignsByClientId = (clientId: string): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.clientId === clientId);
};

export const getTransactionsByClientId = (clientId: string): Transaction[] => {
  return mockTransactions.filter(transaction => transaction.clientId === clientId);
};

export const getTransactionsByCampaignId = (campaignId: string): Transaction[] => {
  return mockTransactions.filter(transaction => transaction.campaignId === campaignId);
};

export const calculateROI = (campaignId: string): number => {
  const campaign = getCampaignById(campaignId);
  if (!campaign) return 0;
  
  return campaign.spent > 0 ? (campaign.revenue - campaign.spent) / campaign.spent : 0;
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};
