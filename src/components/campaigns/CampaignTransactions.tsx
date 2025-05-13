
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Transaction, Campaign } from "@/lib/types";
import { TransactionsList } from "@/components/transactions/TransactionsList";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { TransactionDeleteDialog } from "@/components/transactions/TransactionDeleteDialog";
import { getTransactionsByCampaignId } from "@/lib/mock-data";

interface CampaignTransactionsProps {
  campaign: Campaign;
  clientId: string;
}

export function CampaignTransactions({ campaign, clientId }: CampaignTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    getTransactionsByCampaignId(campaign.id)
  );
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (transactionData: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      ...transactionData,
    } as Transaction;

    setTransactions([...transactions, newTransaction]);
  };

  const handleEditTransaction = (transactionData: Partial<Transaction>) => {
    setTransactions(
      transactions.map((t) => 
        t.id === transactionData.id ? { ...t, ...transactionData } : t
      )
    );
  };

  const handleDeleteTransaction = () => {
    if (currentTransaction) {
      setTransactions(transactions.filter((t) => t.id !== currentTransaction.id));
    }
  };

  const openEditDialog = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Transactions</CardTitle>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </CardHeader>
      <CardContent>
        <TransactionsList 
          transactions={transactions}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      </CardContent>

      <TransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        campaign={campaign}
        clientId={clientId}
        mode="add"
        onSave={handleAddTransaction}
      />

      {currentTransaction && (
        <TransactionDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          campaign={campaign}
          clientId={clientId}
          transaction={currentTransaction}
          mode="edit"
          onSave={handleEditTransaction}
        />
      )}

      <TransactionDeleteDialog
        transaction={currentTransaction}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteTransaction}
      />
    </Card>
  );
}
