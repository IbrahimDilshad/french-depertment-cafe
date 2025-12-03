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
import { menuItems } from "@/lib/placeholder-data";

export default function StockManagementPage() {
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
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <Input type="number" placeholder="Set new quantity" className="h-8"/>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm">Update Stock</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
