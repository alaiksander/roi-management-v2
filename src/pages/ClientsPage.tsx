
import React, { useState } from "react";
import { useLanguage, UI_TEXT } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockClients, mockCampaigns } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Users, Search, Plus } from "lucide-react";
import { ClientAddDialog } from "@/components/clients/ClientAddDialog";

const ClientsPage = () => {
  const { language, setLanguage } = useLanguage();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filter clients based on search
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.company.toLowerCase().includes(search.toLowerCase())
  );

  const getActiveCampaignsCount = (clientId: string) => {
    return mockCampaigns.filter(
      campaign => campaign.clientId === clientId && campaign.status === 'active'
    ).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{UI_TEXT.clients}</h1>
          <p className="text-muted-foreground">
            {/* TODO: Add to UI_TEXT if needed */}
            Kelola klien dan kampanye mereka
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Klien Baru
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={UI_TEXT.search + " " + UI_TEXT.clients + "..."}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => {
          const activeCampaigns = getActiveCampaignsCount(client.id);
          const totalCampaigns = client.campaigns.length;
          
          return (
            <Link to={`/clients/${client.id}`} key={client.id}>
              <Card className="h-full overflow-hidden p-4 transition-all hover:border-primary hover:shadow-md card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Pendapatan</p>
                    <p className="font-medium">{formatCurrency(client.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{UI_TEXT.campaigns}</p>
                    <div className="flex items-center">
                      <p className="font-medium">{totalCampaigns}</p>
                      {activeCampaigns > 0 && (
                        <StatusBadge
                          status={`${activeCampaigns} Aktif`}
                          className="ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Kontak</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">{UI_TEXT.noClientsFound || "Tidak ada klien yang cocok dengan pencarian Anda."}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => setSearch("")}
          >
            Clear search
          </Button>
        </div>
      )}
      
      {/* Add client dialog */}
      <ClientAddDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default ClientsPage;
