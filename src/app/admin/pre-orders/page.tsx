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
import { preOrders } from "@/lib/placeholder-data";
import { format } from "date-fns";

export default function PreOrdersPage() {
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.studentName}</TableCell>
                <TableCell>{order.studentClass}</TableCell>
                <TableCell>
                  {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                </TableCell>
                <TableCell>{format(order.pickupDate, "PPP")}</TableCell>
                <TableCell>
                    <Badge variant={order.status === 'Pending' ? 'destructive' : order.status === 'Ready' ? 'default' : 'secondary'}>
                        {order.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Mark as Ready</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
