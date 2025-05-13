
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
import { Transaction, Campaign, Client } from "@/lib/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockClients, mockCampaigns } from "@/lib/mock-data";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  campaign?: Campaign;
  clientId?: string;
  mode: "add" | "edit";
  onSave: (transaction: Partial<Transaction>) => void;
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

const transactionCategories = [
  "Ad Spend", 
  "Advance Payment", 
  "Final Payment", 
  "Interim Payment",
  "Content Creation",
  "Analytics Fee",
  "Consulting Fee",
  "Other"
];

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  campaign: initialCampaign,
  clientId: initialClientId,
  mode,
  onSave,
}: TransactionDialogProps) {
  const { toast } = useToast();
  const [clients] = useState<Client[]>(mockClients);
  const [availableCampaigns, setAvailableCampaigns] = useState<Campaign[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    initialClientId || transaction?.clientId
  );
  
  // Get all campaigns for the form initialization
  const allCampaigns = mockCampaigns;

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
        category: "Advance Payment",
        description: "",
        clientId: initialClientId || "",
        campaignId: initialCampaign?.id || "",
      };

  const form = useForm<TransactionFormValues>({
    defaultValues,
  });

  // Update available campaigns when client selection changes
  useEffect(() => {
    const clientId = form.watch("clientId");
    if (clientId) {
      setSelectedClientId(clientId);
      const filteredCampaigns = allCampaigns.filter(campaign => campaign.clientId === clientId);
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
  }, [form.watch("clientId")]);

  // Initialize available campaigns on component mount
  useEffect(() => {
    if (selectedClientId) {
      const filteredCampaigns = allCampaigns.filter(campaign => campaign.clientId === selectedClientId);
      setAvailableCampaigns(filteredCampaigns);
    }
  }, []);

  const handleSubmit = (values: TransactionFormValues) => {
    const transactionData: Partial<Transaction> = {
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
    toast({
      title: `${mode === "add" ? "Transaksi berhasil ditambahkan" : "Transaksi berhasil diubah"}`,
      description: `Transaksi berhasil ${mode === "add" ? "ditambahkan" : "diubah"}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Transaksi" : "Ubah Transaksi"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Tambahkan transaksi baru" : "Ubah detail transaksi"}
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
                        {transactionCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
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
                {mode === "add" ? "Tambah Transaksi" : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
