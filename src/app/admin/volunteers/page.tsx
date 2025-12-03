import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { volunteers, menuItems } from "@/lib/placeholder-data";
import { PlusCircle } from "lucide-react";

export default function VolunteerManagementPage() {

  const getAssignedItemNames = (itemIds: string[]) => {
    return itemIds.map(id => menuItems.find(item => item.id === id)?.name).filter(Boolean).join(', ');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Volunteer Management</h1>
         <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Assign Stock
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Volunteer Name</TableHead>
              <TableHead>Assigned Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer.id}>
                <TableCell className="font-medium">{volunteer.name}</TableCell>
                <TableCell>{getAssignedItemNames(volunteer.assignedStock)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit Assignment</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
