
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useCollection, useFirestore } from "@/firebase";
import { PreOrder } from "@/lib/types";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function PreOrdersPage() {
  const { data: preOrders, loading } = useCollection<PreOrder>("preOrders");
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleStatusChange = async (orderId: string, newStatus: PreOrder['status']) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'preOrders', orderId);
    try {
        await updateDoc(orderRef, { status: newStatus });
        toast({ title: 'Success', description: `Order status updated to ${newStatus}` });
    } catch(e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  const getOrderItemsText = (items: Record<string, number>) => {
    return Object.entries(items).map(([itemId, quantity]) => `${quantity}x ${itemId.replace(/([A-Z])/g, ' $1')}`).join(', ');
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">Pre-order Management</h1>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={7} className="text-center">Loading pre-orders...</TableCell></TableRow>}
            {preOrders.sort((a, b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime()).map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.studentName}</TableCell>
                <TableCell>{order.studentClass}</TableCell>
                <TableCell>{getOrderItemsText(order.items)}</TableCell>
                <TableCell>{format(new Date(order.pickupDate), "PPP")}</TableCell>
                <TableCell>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={order.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer">
                            View Screenshot <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                    </Button>
                </TableCell>
                <TableCell>
                    <Badge variant={order.status === 'Pending' ? 'destructive' : order.status === 'Ready' ? 'default' : 'secondary'}>
                        {order.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {order.status === 'Pending' && <Button variant="ghost" size="sm" onClick={() => handleStatusChange(order.id, 'Ready')}>Mark as Ready</Button>}
                  {order.status === 'Ready' && <Button variant="ghost" size="sm" onClick={() => handleStatusChange(order.id, 'Completed')}>Mark as Completed</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
