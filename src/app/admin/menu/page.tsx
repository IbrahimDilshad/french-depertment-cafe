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
import { PlusCircle } from "lucide-react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { MenuItem } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";


export default function MenuManagementPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { data: menuItems, loading, error } = useCollection<MenuItem>("menuItems");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem> | null>(null);

  const openNewItemDialog = () => {
    setIsEditMode(false);
    setCurrentItem({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        availability: 'In Stock',
        imageId: 'croissant',
        isPreOrderOnly: false,
    });
    setIsDialogOpen(true);
  };

  const openEditItemDialog = (item: MenuItem) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!firestore || !currentItem) {
       toast({ variant: "destructive", title: "Error", description: "Firestore not available. Please try again later." });
       return;
    }
    if (!currentItem.name) {
        toast({ variant: "destructive", title: "Error", description: "Item name is required." });
        return;
    }

    if (isEditMode && currentItem.id) {
      const { id, ...itemToUpdate } = currentItem;
      const itemRef = doc(firestore, "menuItems", id);
      updateDoc(itemRef, itemToUpdate)
        .then(() => {
            toast({ title: "Success", description: "Menu item updated." });
        })
        .catch((e: any) => {
            console.error("Firestore update error:", e);
            toast({ 
                variant: "destructive", 
                title: "Error updating item", 
                description: e.message || "An unknown error occurred."
            });
        });
    } else {
      const { id, ...newItem } = currentItem; // remove id before adding
      addDoc(collection(firestore, "menuItems"), newItem)
        .then(() => {
          toast({ title: "Success", description: "New menu item added." });
        })
        .catch((e: any) => {
            console.error("Firestore add error:", e);
            toast({ 
                variant: "destructive", 
                title: "Error adding item", 
                description: e.message || "An unknown error occurred."
            });
        });
    }

    setIsDialogOpen(false);
    setCurrentItem(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Menu Management</h1>
        <Button onClick={openNewItemDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Input id="name" value={currentItem?.name} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value })} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" value={currentItem?.description} onChange={(e) => setCurrentItem({...currentItem, description: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input id="price" type="number" value={currentItem?.price} onChange={(e) => setCurrentItem({...currentItem, price: Number(e.target.value) })} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input id="stock" type="number" value={currentItem?.stock} onChange={(e) => setCurrentItem({...currentItem, stock: Number(e.target.value) })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="availability" className="text-right">Availability</Label>
                 <Select value={currentItem?.availability} onValueChange={(value) => setCurrentItem({...currentItem, availability: value as 'In Stock' | 'Sold Out' })}>
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
                    checked={currentItem?.isPreOrderOnly}
                    onCheckedChange={(checked) => setCurrentItem({...currentItem, isPreOrderOnly: checked})}
                 />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
            {loading && <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={6} className="text-center text-destructive">{error.message}</TableCell></TableRow>}
            {!loading && menuItems.map((item) => (
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEditItemDialog(item)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
