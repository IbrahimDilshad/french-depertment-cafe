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
  DialogTrigger,
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
        imageId: 'croissant'
    });
    setIsDialogOpen(true);
  };

  const openEditItemDialog = (item: MenuItem) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!firestore || !currentItem) return;

    try {
      if (isEditMode && currentItem.id) {
        const itemRef = doc(firestore, "menuItems", currentItem.id);
        await updateDoc(itemRef, currentItem);
        toast({ title: "Success", description: "Menu item updated." });
      } else {
        await addDoc(collection(firestore, "menuItems"), currentItem);
        toast({ title: "Success", description: "New menu item added." });
      }
      setIsDialogOpen(false);
      setCurrentItem(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={5} className="text-center text-destructive">{error.message}</TableCell></TableRow>}
            {!loading && menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={item.availability === 'In Stock' ? 'secondary' : 'destructive'}>
                    {item.availability}
                  </Badge>
                </TableCell>
                <TableCell>{item.stock}</TableCell>
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
