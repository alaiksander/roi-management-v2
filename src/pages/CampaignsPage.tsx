
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockCampaigns, mockClients } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateROI, formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, Search, Plus, ArrowUp } from "lucide-react";

const CampaignsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get clientName by clientId
  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown";
  };

  // Filter campaigns based on search and status
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      getClientName(campaign.clientId).toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || campaign.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your marketing campaigns and track performance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map((campaign) => {
              const roi = calculateROI(campaign.revenue, campaign.spent);
              return (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    <Link to={`/campaigns/${campaign.id}`} className="hover:text-purple-600 hover:underline">
                      {campaign.name}
                    </Link>
                  </TableCell>
                  <TableCell>{getClientName(campaign.clientId)}</TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>{formatDate(campaign.startDate)}</TableCell>
                  <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                  <TableCell>{formatCurrency(campaign.spent)}</TableCell>
                  <TableCell>{formatCurrency(campaign.revenue)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {roi > 0 && <ArrowUp size={14} className="mr-1 text-green-500" />}
                      <span className={roi > 0 ? "text-green-500" : "text-red-500"}>
                        {(roi * 100).toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={campaign.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="bg-purple-100 p-3 rounded-full">
            <Briefcase className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No campaigns found</h3>
          <p className="text-muted-foreground text-center mt-2">
            There are no campaigns matching your search criteria.
          </p>
          <div className="mt-4 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create campaign
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
