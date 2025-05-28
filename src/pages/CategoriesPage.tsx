
import React, { useState } from "react";
import { useLanguage, UI_TEXT } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Search, Plus, Tag, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CategoriesPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Fetch categories from Supabase
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Check if user has any categories, if not create default ones
      const { data: existingCategories, error: fetchError } = await supabase
        .from('TransactionCategory')
        .select('*')
        .eq('userId', user.id);
      
      if (fetchError) throw fetchError;
      
      if (!existingCategories || existingCategories.length === 0) {
        // Create default categories for new user
        await supabase.rpc('create_default_categories_for_user', { user_id: user.id });
        
        // Fetch again after creating defaults
        const { data: newCategories, error: newFetchError } = await supabase
          .from('TransactionCategory')
          .select('*')
          .eq('userId', user.id)
          .order('name');
        
        if (newFetchError) throw newFetchError;
        return newCategories || [];
      }
      
      return existingCategories || [];
    },
    enabled: !!user?.id,
  });

  // Fetch transactions to calculate category usage
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

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: any) => {
      const { data, error } = await supabase
        .from('TransactionCategory')
        .insert([{
          ...newCategory,
          userId: user?.id,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category added",
        description: "New category has been created successfully",
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('TransactionCategory')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('userId', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category updated",
        description: "Category has been updated successfully",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('TransactionCategory')
        .delete()
        .eq('id', id)
        .eq('userId', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully",
        variant: "destructive",
      });
    },
  });

  // Calculate category usage and statistics
  const categoriesWithStats = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category === category.name);
    const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = categoryTransactions.length;
    
    return {
      ...category,
      totalAmount,
      transactionCount,
    };
  });

  // Filter categories
  const filteredCategories = categoriesWithStats.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  // Category type statistics
  const incomeCategories = filteredCategories.filter(c => c.type === 'income' || c.type === 'both');
  const expenseCategories = filteredCategories.filter(c => c.type === 'expense' || c.type === 'both');

  const handleAddCategory = (category: any) => {
    addCategoryMutation.mutate(category);
  };

  const handleUpdateCategory = (id: string, updates: any) => {
    updateCategoryMutation.mutate({ id, updates });
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
            <p className="text-muted-foreground">Kelola kategori transaksi Anda</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
          <p className="text-muted-foreground">Kelola kategori transaksi Anda</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{incomeCategories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expenseCategories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Manager */}
      <CategoryManager 
        categories={filteredCategories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

export default CategoriesPage;
