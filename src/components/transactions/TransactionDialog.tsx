
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/lib/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSave: (transaction: any) => void;
  clients: any[];
  campaigns: any[];
  categories: any[];
}

interface TransactionFormValues {
  date: string;
  amount: string;
  type: "income" | "expense";
  category: string;
  description: string;
  clientId: string;
  campaignId: string;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSave,
  clients,
  campaigns,
  categories,
}: TransactionDialogProps) {
  const { toast } = useToast();
  const [availableCampaigns, setAvailableCampaigns] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    transaction?.clientId
  );
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    transaction?.type || "income"
  );

  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(cat => 
    cat.type === selectedType || cat.type === "both"
  );

  // Initialize form values
  const defaultValues: TransactionFormValues = transaction
    ? {
        date: transaction.date.split("T")[0],
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        clientId: transaction.clientId,
        campaignId: transaction.campaignId,
      }
    : {
        date: new Date().toISOString().split("T")[0],
        amount: "",
        type: "income",
        category: filteredCategories.length > 0 ? filteredCategories[0].name : "",
        description: "",
        clientId: "",
        campaignId: "",
      };

  const form = useForm<TransactionFormValues>({
    defaultValues,
  });

  // Update available campaigns when client selection changes
  useEffect(() => {
    const clientId = form.watch("clientId");
    if (clientId) {
      setSelectedClientId(clientId);
      const filteredCampaigns = campaigns.filter(campaign => campaign.clientId === clientId);
      setAvailableCampaigns(filteredCampaigns);
      
      // If current campaign selection is not valid for the new client, reset it
      const currentCampaignId = form.watch("campaignId");
      const isCampaignValid = filteredCampaigns.some(c => c.id === currentCampaignId);
      if (!isCampaignValid && filteredCampaigns.length > 0) {
        form.setValue("campaignId", filteredCampaigns[0].id);
      }
    } else {
      setAvailableCampaigns([]);
    }
  }, [form.watch("clientId"), campaigns]);

  // Watch for type changes to update filtered categories
  useEffect(() => {
    const type = form.watch("type");
    setSelectedType(type);
    
    // Reset category if current selection is not valid for the new type
    const currentCategory = form.watch("category");
    const isValidCategory = filteredCategories.some(cat => cat.name === currentCategory);
    
    if (!isValidCategory && filteredCategories.length > 0) {
      form.setValue("category", filteredCategories[0].name);
    }
  }, [form.watch("type"), categories]);

  // Initialize available campaigns on component mount
  useEffect(() => {
    if (selectedClientId) {
      const filteredCampaigns = campaigns.filter(campaign => campaign.clientId === selectedClientId);
      setAvailableCampaigns(filteredCampaigns);
    }
  }, [selectedClientId, campaigns]);

  const handleSubmit = (values: TransactionFormValues) => {
    const transactionData = {
      ...(transaction?.id ? { id: transaction.id } : {}),
      clientId: values.clientId,
      campaignId: values.campaignId,
      date: values.date,
      amount: parseFloat(values.amount),
      type: values.type,
      category: values.category,
      description: values.description,
    };

    onSave(transactionData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </DialogTitle>
          <DialogDescription>
            {transaction ? "Edit detail transaksi" : "Tambahkan transaksi baru"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Klien</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campaignId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kampanye</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedClientId || availableCampaigns.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCampaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Pemasukan</SelectItem>
                        <SelectItem value="expense">Pengeluaran</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah (IDR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi transaksi"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit">
                {transaction ? "Simpan Perubahan" : "Tambah Transaksi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
