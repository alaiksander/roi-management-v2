import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Edit, Trash2, Plus, Filter } from "lucide-react";
import { TransactionCategory } from "@/lib/types";

export type TransactionCategory = {
  id: string;
  name: string;
  type: "income" | "expense" | "both";
  color?: string;
};

const CategoryManager = () => {
  // Load categories from localStorage or use defaults
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  
  // Load categories from localStorage on component mount
  useEffect(() => {
    const storedCategories = localStorage.getItem("transactionCategories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Default categories if none exist
      const defaultCategories: TransactionCategory[] = [
        { id: "cat-1", name: "Salary", type: "income" },
        { id: "cat-2", name: "Freelance", type: "income" },
        { id: "cat-3", name: "Advertising", type: "expense" },
        { id: "cat-4", name: "Content Creation", type: "expense" },
        { id: "cat-5", name: "Consulting", type: "both" },
      ];
      setCategories(defaultCategories);
      localStorage.setItem("transactionCategories", JSON.stringify(defaultCategories));
    }
  }, []);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<TransactionCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<TransactionCategory>>({
    name: "",
    type: "both"
  });

  // Filter categories based on search and type filter
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || category.type === typeFilter || 
                        (typeFilter === "both" && category.type === "both");
    
    return matchesSearch && matchesType;
  });

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactionCategories", JSON.stringify(categories));
  }, [categories]);

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.type) {
      toast.error("Nama dan tipe kategori harus diisi");
      return;
    }

    const id = `cat-${Date.now()}`;
    const updatedCategories = [...categories, { ...newCategory as TransactionCategory, id }];
    setCategories(updatedCategories);
    localStorage.setItem("transactionCategories", JSON.stringify(updatedCategories));
    
    toast.success("Kategori berhasil ditambahkan");
    setIsAddDialogOpen(false);
    resetNewCategory();
  };

  // Edit category
  const handleEditCategory = () => {
    if (!currentCategory || !currentCategory.name || !currentCategory.type) {
      toast.error("Nama dan tipe kategori harus diisi");
      return;
    }

    const updatedCategories = categories.map(cat => 
      cat.id === currentCategory.id ? currentCategory : cat
    );
    
    setCategories(updatedCategories);
    localStorage.setItem("transactionCategories", JSON.stringify(updatedCategories));
    
    toast.success("Kategori berhasil diperbarui");
    setIsEditDialogOpen(false);
  };

  // Delete category
  const handleDeleteCategory = () => {
    if (currentCategory) {
      const updatedCategories = categories.filter(cat => cat.id !== currentCategory.id);
      setCategories(updatedCategories);
      localStorage.setItem("transactionCategories", JSON.stringify(updatedCategories));
      
      toast.success("Kategori berhasil dihapus");
      setIsDeleteDialogOpen(false);
    }
  };

  // Open edit dialog and set current category
  const openEditDialog = (category: TransactionCategory) => {
    setCurrentCategory({...category});
    setIsEditDialogOpen(true);
  };

  // Open delete dialog and set current category
  const openDeleteDialog = (category: TransactionCategory) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Reset new category form
  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      type: "both"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori Transaksi</h1>
          <p className="text-muted-foreground">
            Kelola kategori untuk transaksi pemasukan dan pengeluaran
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="income">Pemasukan</SelectItem>
              <SelectItem value="expense">Pengeluaran</SelectItem>
              <SelectItem value="both">Keduanya</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {category.type === "income" && "Pemasukan"}
                  {category.type === "expense" && "Pengeluaran"}
                  {category.type === "both" && "Keduanya"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteDialog(category)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="bg-purple-100 p-3 rounded-full">
            <Filter className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Tidak ada kategori ditemukan</h3>
          <p className="text-muted-foreground text-center mt-2">
            Tidak ada kategori yang cocok dengan filter Anda.
          </p>
          <div className="mt-4 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
              }}
            >
              Bersihkan filter
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Tambah kategori
            </Button>
          </div>
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
            <DialogDescription>
              Buat kategori baru untuk transaksi Anda
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="Masukkan nama kategori"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe Kategori</Label>
              <Select 
                value={newCategory.type} 
                onValueChange={(value) => setNewCategory({...newCategory, type: value as "income" | "expense" | "both"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                  <SelectItem value="both">Keduanya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              resetNewCategory();
            }}>
              Batal
            </Button>
            <Button onClick={handleAddCategory}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      {currentCategory && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Kategori</DialogTitle>
              <DialogDescription>
                Perbarui detail kategori transaksi
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nama Kategori</Label>
                <Input
                  id="edit-name"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Tipe Kategori</Label>
                <Select 
                  value={currentCategory.type} 
                  onValueChange={(value) => setCurrentCategory({...currentCategory, type: value as "income" | "expense" | "both"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                    <SelectItem value="both">Keduanya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditCategory}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori "{currentCategory?.name}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
