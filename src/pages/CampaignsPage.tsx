
import React, { useState } from "react";
import { useLanguage, UI_TEXT } from "@/context/LanguageContext";
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
import { Briefcase, Search, Plus, ArrowUp, Eye, Edit, Trash2 } from "lucide-react";
import { Campaign } from "@/lib/types";
import { CampaignDetailsDialog } from "@/components/campaigns/CampaignDetailsDialog";
import { CampaignAddDialog } from "@/components/campaigns/CampaignAddDialog";
import { CampaignEditDialog } from "@/components/campaigns/CampaignEditDialog";
import { CampaignDeleteDialog } from "@/components/campaigns/CampaignDeleteDialog";

const CampaignsPage = () => {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  
  // Dialog states
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Get clientName by clientId
  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown";
  };

  // Filter campaigns based on search and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      getClientName(campaign.clientId).toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || campaign.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  // Handle adding a campaign
  const handleAddCampaign = (newCampaign: Campaign) => {
    setCampaigns([...campaigns, newCampaign]);
  };

  // Handle updating a campaign
  const handleUpdateCampaign = (id: string, updatedData: Partial<Campaign>) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, ...updatedData } : campaign
      )
    );
  };

  // Handle deleting a campaign
  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  };

  // Open campaign details dialog
  const openDetailsDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsOpen(true);
  };

  // Open campaign edit dialog
  const openEditDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditOpen(true);
  };

  // Open campaign delete dialog
  const openDeleteDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{UI_TEXT.campaigns}</h1>
          <p className="text-muted-foreground">
            {/* TODO: Add to UI_TEXT if needed */}
            {UI_TEXT.manageCampaigns || "Kelola kampanye pemasaran Anda dan lacak kinerjanya"}
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {UI_TEXT.newCampaign || "Kampanye Baru"}
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
              <TableHead>Platform</TableHead>
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
          <h3 className="mt-4 text-lg font-semibold">{UI_TEXT.noCampaignsFound || "Tidak ada kampanye"}</h3>
          <p className="text-muted-foreground text-center mt-2">
            {UI_TEXT.noCampaignsCriteria || "Tidak ada kampanye yang cocok dengan kriteria pencarian Anda."}
          </p>
          <div className="mt-4 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Bersihkan filter
            </Button>
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
        onAddCampaign={handleAddCampaign}
      />
      
      <CampaignEditDialog 
        campaign={selectedCampaign}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdateCampaign={handleUpdateCampaign}
      />
      
      <CampaignDeleteDialog 
        campaign={selectedCampaign}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleteCampaign={handleDeleteCampaign}
      />
    </div>
  );
};

export default CampaignsPage;
