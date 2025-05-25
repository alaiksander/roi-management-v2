
import React, { useState } from "react";
import { useLanguage, UI_TEXT } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
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
import { Briefcase, Search, Plus, ArrowUp, Edit, Trash2 } from "lucide-react";
import { CampaignDetailsDialog } from "@/components/campaigns/CampaignDetailsDialog";
import { CampaignAddDialog } from "@/components/campaigns/CampaignAddDialog";
import { CampaignEditDialog } from "@/components/campaigns/CampaignEditDialog";
import { CampaignDeleteDialog } from "@/components/campaigns/CampaignDeleteDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const CampaignsPage = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Dialog states
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch campaigns from Supabase
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('Campaign')
        .select('*, Client!Campaign_clientId_fkey(name)')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch transactions to calculate revenue and spent
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq('userId', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate campaign metrics
  const campaignsWithMetrics = campaigns.map(campaign => {
    const campaignTransactions = transactions.filter(t => t.campaignId === campaign.id);
    const revenue = campaignTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const spent = campaignTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...campaign,
      revenue,
      spent,
    };
  });

  // Filter campaigns based on search and status
  const filteredCampaigns = campaignsWithMetrics.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      (campaign.Client?.name || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || campaign.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  // Open campaign details dialog
  const openDetailsDialog = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsDetailsOpen(true);
  };

  // Open campaign edit dialog
  const openEditDialog = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsEditOpen(true);
  };

  // Open campaign delete dialog
  const openDeleteDialog = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{UI_TEXT.campaigns}</h1>
            <p className="text-muted-foreground">Kelola kampanye pemasaran Anda dan lacak kinerjanya</p>
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
          <h1 className="text-2xl font-bold tracking-tight">{UI_TEXT.campaigns}</h1>
          <p className="text-muted-foreground">Kelola kampanye pemasaran Anda dan lacak kinerjanya</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Kampanye Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari kampanye atau klien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
              <SelectItem value="paused">Ditunda</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kampanye</TableHead>
              <TableHead>Klien</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Anggaran</TableHead>
              <TableHead>Pengeluaran</TableHead>
              <TableHead>Pendapatan</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map((campaign) => {
              const roi = calculateROI(campaign.revenue, campaign.spent);
              return (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    {campaign.name}
                  </TableCell>
                  <TableCell>{campaign.Client?.name || 'No Client'}</TableCell>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(campaign)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
          <h3 className="mt-4 text-lg font-semibold">
            {campaigns.length === 0 ? "Belum ada kampanye" : "Tidak ada kampanye ditemukan"}
          </h3>
          <p className="text-muted-foreground text-center mt-2">
            {campaigns.length === 0 
              ? "Buat kampanye pertama Anda untuk memulai melacak kinerja pemasaran."
              : "Tidak ada kampanye yang cocok dengan kriteria pencarian Anda."}
          </p>
          <div className="mt-4 flex gap-3">
            {campaigns.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
              >
                Bersihkan filter
              </Button>
            )}
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Buat kampanye
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CampaignDetailsDialog 
        campaign={selectedCampaign} 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen}
      />
      
      <CampaignAddDialog 
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      />
      
      <CampaignEditDialog 
        campaign={selectedCampaign}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
      
      <CampaignDeleteDialog 
        campaign={selectedCampaign}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
};

export default CampaignsPage;
