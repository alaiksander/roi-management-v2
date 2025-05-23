
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTransactions, mockCampaigns } from "@/lib/mock-data";
import { ArrowUp, ArrowDown, CalendarDays } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"transactions" | "campaigns">("transactions");

  // Group transactions by date
  const groupedTransactions = mockTransactions.reduce<Record<string, typeof mockTransactions>>(
    (acc, transaction) => {
      const dateKey = transaction.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(transaction);
      return acc;
    },
    {}
  );

  // Get transactions for selected date
  const selectedDateStr = date ? date.toISOString().split("T")[0] : "";
  const transactionsOnDate = groupedTransactions[selectedDateStr] || [];
  
  // Get active campaigns on selected date
  const campaignsOnDate = mockCampaigns.filter(campaign => {
    const campaignStart = new Date(campaign.startDate);
    const campaignEnd = campaign.endDate ? new Date(campaign.endDate) : new Date();
    
    return (
      date &&
      campaignStart <= date &&
      campaignEnd >= date
    );
  });

  // Calculate total income and expenses for selected date
  const totalIncome = transactionsOnDate
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpenses = transactionsOnDate
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Function to determine which dates have transactions
  const isDayWithTransaction = (day: Date): boolean => {
    const dateKey = day.toISOString().split("T")[0];
    return !!groupedTransactions[dateKey];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View transactions and campaigns by date
          </p>
        </div>
        <Select value={view} onValueChange={(value: "transactions" | "campaigns") => setView(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="transactions">Transactions</SelectItem>
              <SelectItem value="campaigns">Active Campaigns</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 overflow-hidden card-hover">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" /> 
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border-t"
              modifiers={{
                withTransaction: (date) => isDayWithTransaction(date),
              }}
              modifiersClassNames={{
                withTransaction: "font-bold bg-purple-100 text-purple-900",
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="text-lg">
              {date
                ? date.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {date && view === "transactions" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="text-muted-foreground text-sm">Income</div>
                    <div className="text-green-600 text-lg font-semibold">
                      {formatCurrency(totalIncome)}
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md">
                    <div className="text-muted-foreground text-sm">Expenses</div>
                    <div className="text-red-600 text-lg font-semibold">
                      {formatCurrency(totalExpenses)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Transactions</h3>
                  {transactionsOnDate.length > 0 ? (
                    <div className="space-y-2">
                      {transactionsOnDate.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "income"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {transaction.category}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {transaction.description}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            } font-semibold`}
                          >
                            {transaction.type === "income" ? "+" : "-"}{" "}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-4">
                      No transactions on this date
                    </div>
                  )}
                </div>
              </div>
            )}

            {date && view === "campaigns" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Active Campaigns</h3>
                {campaignsOnDate.length > 0 ? (
                  <div className="space-y-3">
                    {campaignsOnDate.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="p-3 border rounded-md"
                      >
                        <div className="flex justify-between">
                          <div className="font-medium">{campaign.name}</div>
                          <Badge
                            className={
                              campaign.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : campaign.status === "paused"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {campaign.platform}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget:</span>{" "}
                            {formatCurrency(campaign.budget)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Spent:</span>{" "}
                            {formatCurrency(campaign.spent)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-4">
                    No active campaigns on this date
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
