
"use client";

import { useState } from "react";
import { useAuth, useCollection, useDatabase } from "@/firebase";
import { UserProfile } from "@/lib/types";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

const allAdminPages = [
  { id: "/admin", label: "Dashboard" },
  { id: "/admin/analytics", label: "Analytics" },
  { id: "/admin/menu", label: "Menu" },
  { id: "/admin/stock", label: "Stock" },
  { id: "/admin/pre-orders", label: "Pre-orders" },
  { id: "/admin/team", label: "Team" },
  { id: "/admin/announcements", label: "Announcements" },
];

export default function TeamManagementPage() {
  const db = useDatabase();
  const auth = useAuth();
  const { toast } = useToast();
  // We will re-enable user listing after the first admin is created.
  // const { data: users, loading } = useCollection<UserProfile>("users");
  const users: UserProfile[] = [];
  const loading = false;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessiblePages, setAccessiblePages] = useState<string[]>([]);

  const handleAddTeamMember = async () => {
    if (!auth || !db) {
      toast({ variant: "destructive", title: "Error", description: "Firebase not initialized." });
      return;
    }
    if (!email || !password || !displayName) {
        toast({ variant: "destructive", title: "Error", description: "All fields are required." });
        return;
    }
     if (accessiblePages.length === 0) {
        toast({ variant: "destructive", title: "Error", description: "Please select at least one accessible page." });
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const newUserProfile: Omit<UserProfile, 'id' | 'role'> & { accessiblePages: string[] } = {
        displayName: displayName,
        email: user.email!,
        photoURL: '',
        accessiblePages: accessiblePages,
      };

      await set(ref(db, `users/${user.uid}`), newUserProfile);

      toast({ title: "Success", description: "Team member added successfully." });
      setIsDialogOpen(false);
      setEmail("");
      setPassword("");
      setDisplayName("");
      setAccessiblePages([]);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed to add member", description: error.message });
    }
  };

  const handlePageAccessChange = (pageId: string) => {
    setAccessiblePages(prev => 
        prev.includes(pageId) ? prev.filter(p => p !== pageId) : [...prev, pageId]
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Team Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Create an account and assign page permissions. For a super admin, select all pages.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
              </div>
              <div className="col-span-4 space-y-2">
                <Label>Page Access</Label>
                <div className="grid grid-cols-2 gap-2 rounded-md border p-2">
                    {allAdminPages.map(page => (
                        <div key={page.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={page.id} 
                                onCheckedChange={() => handlePageAccessChange(page.id)}
                                checked={accessiblePages.includes(page.id)}
                            />
                            <Label htmlFor={page.id} className="text-sm font-normal">{page.label}</Label>
                        </div>
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTeamMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Display Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Accessible Pages</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={4} className="text-center">Loading team members...</TableCell></TableRow>}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.accessiblePages?.join(', ') || 'None'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
             {!loading && users.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No team members found. Add your first admin!</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
