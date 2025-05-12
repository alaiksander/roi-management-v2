
import React from "react";
import { useNavigate } from "react-router-dom";
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
import { Client } from "@/lib/types";

interface ClientDeleteDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDeleteDialog({ client, open, onOpenChange }: ClientDeleteDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDelete = () => {
    // In a real app, this would delete the client from the database
    console.log("Deleting client:", client.id);
    
    toast({
      title: "Client deleted",
      description: "Client has been deleted successfully",
      variant: "destructive",
    });
    
    onOpenChange(false);
    
    // Navigate back to clients list
    setTimeout(() => navigate('/clients'), 500);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the client "{client.name}" from {client.company} 
            and all associated data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
