
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Campaign } from "@/lib/types";
import { getClientById } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, calculateROI } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { CampaignTransactions } from "@/components/campaigns/CampaignTransactions";

interface CampaignDetailsDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDetailsDialog({
  campaign,
  open,
  onOpenChange,
}: CampaignDetailsDialogProps) {
  if (!campaign) return null;

  const client = getClientById(campaign.clientId);
  const roi = calculateROI(campaign.revenue, campaign.spent);
  const isPositiveROI = roi > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{campaign.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">Client:</span>
              <h3 className="text-lg font-medium">{client?.name || "Unknown"}</h3>
            </div>
            <Badge variant={campaign.status === "active" ? "success" : 
                          campaign.status === "completed" ? "default" : "warning"}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Platform</div>
                <div className="text-2xl font-bold">{campaign.platform}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-lg font-bold">
                  {formatDate(campaign.startDate)} - {campaign.endDate ? formatDate(campaign.endDate) : "Ongoing"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">ROI</div>
                <div className={`text-2xl font-bold flex items-center ${isPositiveROI ? "text-green-500" : "text-red-500"}`}>
                  {isPositiveROI && <ArrowUp className="mr-1" size={18} />}
                  {!isPositiveROI && <ArrowDown className="mr-1" size={18} />}
                  {(roi * 100).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Budget</div>
                <div className="text-2xl font-bold">{formatCurrency(campaign.budget)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Spent</div>
                <div className="text-2xl font-bold">{formatCurrency(campaign.spent)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((campaign.spent / campaign.budget) * 100).toFixed(1)}% of budget
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Revenue</div>
                <div className="text-2xl font-bold">{formatCurrency(campaign.revenue)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-4">Campaign Transactions</h3>
            <CampaignTransactions campaign={campaign} clientId={campaign.clientId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
