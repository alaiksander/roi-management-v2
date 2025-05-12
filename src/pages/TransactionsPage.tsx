
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockTransactions, mockClients, mockCampaigns } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, ArrowUp, ArrowDown, Plus, Filter } from "lucide-react";

const TransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");

  // Total income and expenses calculations
  const totalIncome = mockTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = mockTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  // Get client and campaign names
  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown";
  };

  const getCampaignName = (campaignId: string) => {
    const campaign = mockCampaigns.find((c) => c.id === campaignId);
    return campaign ? campaign.name : "Unknown";
  };

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.description.toLowerCase().includes(search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(search.toLowerCase()) ||
      getClientName(transaction.clientId).toLowerCase().includes(search.toLowerCase()) ||
      getCampaignName(transaction.campaignId).toLowerCase().includes(search.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    // Client filter
    const matchesClient = clientFilter === "all" || transaction.clientId === clientFilter;
    
    // Campaign filter
    const matchesCampaign = campaignFilter === "all" || transaction.campaignId === campaignFilter;
    
    return matchesSearch && matchesType && matchesClient && matchesCampaign;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and view all financial transactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2 rounded-full bg-green-100 p-2 text-green-600">
                <ArrowUp className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2 rounded-full bg-red-100 p-2 text-red-600">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome - totalExpenses)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Clients</SelectItem>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={campaignFilter} onValueChange={setCampaignFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Campaigns</SelectItem>
              {mockCampaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`mr-2 rounded-full p-1 ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                </TableCell>
                <TableCell className={`font-medium ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>{getClientName(transaction.clientId)}</TableCell>
                <TableCell>{getCampaignName(transaction.campaignId)}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="bg-purple-100 p-3 rounded-full">
            <Filter className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No transactions found</h3>
          <p className="text-muted-foreground text-center mt-2">
            There are no transactions matching your current filters.
          </p>
          <div className="mt-4 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setClientFilter("all");
                setCampaignFilter("all");
              }}
            >
              Clear filters
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add transaction
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
