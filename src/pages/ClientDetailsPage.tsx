import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Building, Mail, Phone, 
  CalendarRange, TrendingUp, DollarSign 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { 
  getClientById, getCampaignsByClientId, 
  getTransactionsByClientId, formatRupiah 
} from "@/lib/mock-data";
import { ClientEditDialog } from "@/components/clients/ClientEditDialog";
import { ClientDeleteDialog } from "@/components/clients/ClientDeleteDialog";
import { CampaignTransactions } from "@/components/campaigns/CampaignTransactions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const ClientDetailsPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const client = clientId ? getClientById(clientId) : undefined;
  const campaigns = clientId ? getCampaignsByClientId(clientId) : [];
  const transactions = clientId ? getTransactionsByClientId(clientId) : [];
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    campaigns.length > 0 ? campaigns[0].id : null
  );
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold mb-4">Klien tidak ditemukan</h1>
        <Button onClick={() => navigate('/clients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Klien
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/clients')}
            className="p-0 h-8 w-8 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
            <p className="text-muted-foreground">{client.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Hapus
          </Button>
        </div>
      </div>
      
      {/* Client info cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 opacity-70" />
              <span className="text-sm">{client.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              <a href={`mailto:${client.email}`} className="text-sm hover:underline">
                {client.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 opacity-70" />
              <a href={`tel:${client.phone}`} className="text-sm hover:underline">
                {client.phone}
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Ringkasan Kampanye</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Kampanye</span>
              <span className="text-sm font-medium">{client.campaigns.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Kampanye Aktif</span>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{activeCampaigns}</span>
                {activeCampaigns > 0 && <StatusBadge status="Active" />}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Kampanye Pertama</span>
              <span className="text-sm font-medium">
                {campaigns.length > 0 
                  ? new Date(campaigns
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
                    .startDate).toLocaleDateString('id-ID')
                  : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Ringkasan Keuangan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Pendapatan</span>
              <span className="text-sm font-medium">{formatCurrency(client.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Pengeluaran</span>
              <span className="text-sm font-medium">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Keuntungan Bersih</span>
              <span className="text-sm font-medium">{formatCurrency(totalIncome - totalSpent)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Campaigns list */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Kampanye</h2>
          <Button onClick={() => navigate("/campaigns")}>
            Lihat Semua Kampanye
          </Button>
        </div>
        
        {campaigns.length > 0 ? (
          <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card 
                  key={campaign.id} 
                  className={`card-hover cursor-pointer ${selectedCampaignId === campaign.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                      </div>
                      <StatusBadge status={campaign.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Tanggal Mulai</p>
                        <p className="text-sm font-medium">
                          {new Date(campaign.startDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tanggal Selesai</p>
                        <p className="text-sm font-medium">
                          {campaign.endDate 
                            ? new Date(campaign.endDate).toLocaleDateString('id-ID')
                            : 'Ongoing'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Anggaran</p>
                        <p className="text-sm font-medium">{formatCurrency(campaign.budget)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pengeluaran</p>
                        <p className="text-sm font-medium">{formatCurrency(campaign.spent)}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Pendapatan</p>
                        <p className="text-sm font-medium">{formatCurrency(campaign.revenue)}</p>
                      </div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <p className="text-sm font-medium">
                          {Math.round((campaign.revenue / campaign.spent - 1) * 100)}% ROI
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Selected campaign transactions */}
            {selectedCampaignId && (
              <div className="mt-6">
                {campaigns
                  .filter(campaign => campaign.id === selectedCampaignId)
                  .map(campaign => (
                    <CampaignTransactions 
                      key={campaign.id}
                      campaign={campaign}
                      clientId={client.id}
                    />
                  ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Tidak ada kampanye ditemukan untuk klien ini</p>
            <Button onClick={() => navigate("/campaigns")}>
              Lihat Semua Kampanye
            </Button>
          </Card>
        )}
      </div>
      
      {/* Dialogs */}
      <ClientEditDialog 
        client={client} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
      />
      
      <ClientDeleteDialog 
        client={client} 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
};

export default ClientDetailsPage;
