
"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2 } from "lucide-react";
import { useCollection, useDatabase } from "@/firebase";
import { MenuItem } from "@/lib/types";
import { ref, set, push, remove } from "firebase/database";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const defaultItemState: Partial<MenuItem> = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    availability: 'In Stock',
    imageId: 'croissant',
    isPreOrderOnly: false,
};

export default function MenuManagementPage() {
  const db = useDatabase();
  const { toast } = useToast();
  const { data: menuItems, loading, error } = useCollection<MenuItem>("menuItems");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>(defaultItemState);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const openNewItemDialog = () => {
    setIsEditMode(false);
    setCurrentItem(defaultItemState);
    setIsDialogOpen(true);
  };

  const openEditItemDialog = (item: MenuItem) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
        setCurrentItem(defaultItemState);
    }, 150);
  }

  const handleSave = async () => {
    if (!db) {
       toast({ variant: "destructive", title: "Error", description: "Database is not properly initialized. Please refresh and try again." });
       return;
    }
    if (!currentItem || !currentItem.name) {
        toast({ variant: "destructive", title: "Error", description: "Item name is required." });
        return;
    }

    try {
      if (isEditMode && currentItem.id) {
        const { id, ...itemToUpdate } = currentItem;
        const itemRef = ref(db, `menuItems/${id}`);
        await set(itemRef, itemToUpdate);
        toast({ title: "Success", description: "Menu item updated." });
      } else {
        const { id, ...newItem } = currentItem; // remove id before adding
        const collectionRef = ref(db, "menuItems");
        const newItemRef = push(collectionRef);
        await set(newItemRef, newItem);
        toast({ title: "Success", description: "New menu item added." });
      }
      handleDialogClose();
    } catch (e: any) {
        console.error("Database write error:", e);
        toast({ 
            variant: "destructive", 
            title: "Error saving item", 
            description: e.message || "An unknown error occurred. Check the console and database rules."
        });
    }
  };

  const handleDelete = async () => {
    if (!db || !itemToDelete) return;
    try {
        const itemRef = ref(db, `menuItems/${itemToDelete.id}`);
        await remove(itemRef);
        toast({ title: "Success", description: `${itemToDelete.name} has been deleted.`})
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: `Could not delete item: ${e.message}`})
    } finally {
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Menu Management</h1>
        <Button onClick={openNewItemDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit' : 'Add New'} Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details for the menu item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={currentItem.name} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value })} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" value={currentItem.description} onChange={(e) => setCurrentItem({...currentItem, description: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input id="price" type="number" value={currentItem.price} onChange={(e) => setCurrentItem({...currentItem, price: Number(e.target.value) })} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input id="stock" type="number" value={currentItem.stock} onChange={(e) => setCurrentItem({...currentItem, stock: Number(e.target.value) })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="availability" className="text-right">Availability</Label>
                 <Select value={currentItem.availability} onValueChange={(value) => setCurrentItem({...currentItem, availability: value as 'In Stock' | 'Sold Out' })}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Sold Out">Sold Out</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pre-order-only" className="text-right">Pre-order Only</Label>
                <Switch 
                    id="pre-order-only"
                    checked={!!currentItem.isPreOrderOnly}
                    onCheckedChange={(checked) => setCurrentItem({...currentItem, isPreOrderOnly: checked})}
                 />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the item
                        <span className="font-semibold"> {itemToDelete?.name}</span> from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Yes, delete item
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-center">Loading menu from database...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={6} className="text-center text-destructive">Error: {error.message}</TableCell></TableRow>}
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>Rs{item.price.toFixed(0)}</TableCell>
                <TableCell>
                  <Badge variant={item.availability === 'In Stock' ? 'secondary' : 'destructive'}>
                    {item.availability}
                  </Badge>
                </TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                    <Badge variant={item.isPreOrderOnly ? 'outline' : 'default'}>
                        {item.isPreOrderOnly ? 'Pre-order' : 'Daily'}
                    </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditItemDialog(item)}>Edit</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => openDeleteDialog(item)}>
                    <Trash2 className="h-4 w-4"/>
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {!loading && menuItems.length === 0 && <TableRow><TableCell colSpan={6} className="text-center">No menu items found. Add one to get started!</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
