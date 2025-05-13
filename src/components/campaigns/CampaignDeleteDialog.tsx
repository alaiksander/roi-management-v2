
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface CampaignDeleteDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteCampaign: (id: string) => void;
}

export function CampaignDeleteDialog({
  campaign,
  open,
  onOpenChange,
  onDeleteCampaign,
}: CampaignDeleteDialogProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    if (campaign) {
      onDeleteCampaign(campaign.id);
      toast({
        title: "Campaign deleted",
        description: "Campaign has been deleted successfully",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  };

  if (!campaign) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the campaign "{campaign.name}" with a budget of {formatCurrency(campaign.budget)}.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
