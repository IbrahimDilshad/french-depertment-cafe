
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
import { Input } from "@/components/ui/input";
import { useCollection, useDatabase } from "@/firebase";
import { MenuItem } from "@/lib/types";
import { useState } from "react";
import { ref, update } from "firebase/database";
import { useToast } from "@/hooks/use-toast";

export default function StockManagementPage() {
  const { data: menuItems, loading } = useCollection<MenuItem>("menuItems");
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
  const db = useDatabase();
  const { toast } = useToast();

  const handleStockChange = (itemId: string, value: string) => {
    const newStock = Number(value);
    if (!isNaN(newStock) && newStock >= 0) {
      setStockLevels(prev => ({ ...prev, [itemId]: newStock }));
    }
  };

  const handleUpdateStock = async (itemId: string) => {
    if (!db || stockLevels[itemId] === undefined) return;
    
    const itemRef = ref(db, `menuItems/${itemId}`);
    const newStock = stockLevels[itemId];

    try {
      await update(itemRef, { stock: newStock });
      toast({ title: "Success", description: "Stock updated successfully." });
    } catch(e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">Stock Management</h1>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead className="w-[150px]">New Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={4} className="text-center">Loading stock...</TableCell></TableRow>}
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    placeholder="Set new quantity" 
                    className="h-8"
                    value={stockLevels[item.id] ?? ''}
                    onChange={(e) => handleStockChange(item.id, e.target.value)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => handleUpdateStock(item.id)} disabled={stockLevels[item.id] === undefined}>Update Stock</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
