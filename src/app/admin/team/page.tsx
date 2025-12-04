
"use client";

import { useState, useEffect } from "react";
import { useAuth, useCollection, useFirestore, useUser } from "@/firebase";
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";


export default function TeamManagementPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useUser();
  const { data: users, loading: usersLoading } = useCollection<UserProfile>("users");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserProfile['role']>('Volunteer');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const loading = authLoading || usersLoading;

  useEffect(() => {
    // If the authenticated user is loaded and there are no users in the database,
    // this must be the first user. Automatically make them an admin.
    if (!loading && authUser && users.length === 0) {
      if (!firestore) return;

      const userProfileRef = doc(firestore, `users/${authUser.uid}`);
      const newAdminProfile: Omit<UserProfile, 'id'> = {
        displayName: authUser.displayName || "Admin",
        email: authUser.email!,
        photoURL: authUser.photoURL || '',
        role: "Admin",
      };

      setDoc(userProfileRef, newAdminProfile)
        .then(() => {
          toast({
            title: "Admin Account Created",
            description: "You have been automatically assigned the Admin role.",
          });
        })
        .catch((error) => {
          console.error("Failed to create first admin profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not create initial admin account.",
          });
        });
    }
  }, [loading, authUser, users, firestore, toast]);


  const resetForm = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setRole("Volunteer");
    setCurrentUser(null);
  };
  
  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  }

  const handleAddTeamMember = async () => {
    if (!auth || !firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firebase not initialized." });
      return;
    }
    if (!email || !password || !displayName) {
        toast({ variant: "destructive", title: "Error", description: "All fields are required." });
        return;
    }

    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create the user profile in Firestore with the assigned role
      const newUserProfile: Omit<UserProfile, 'id'> = {
        displayName: displayName,
        email: user.email!,
        photoURL: '',
        role: role,
      };
      await setDoc(doc(firestore, `users/${user.uid}`), newUserProfile);
      
      toast({ title: "Success", description: "Team member added successfully." });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already registered. Please use a different email.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "The password is too weak. It should be at least 6 characters long.";
      }
      toast({ variant: "destructive", title: "Failed to add member", description: errorMessage });
    }
  };

  const handleOpenEditDialog = (user: UserProfile) => {
    setCurrentUser(user);
    setDisplayName(user.displayName);
    setRole(user.role || 'Volunteer');
    setIsEditDialogOpen(true);
  }

  const handleUpdateTeamMember = async () => {
    if (!firestore || !currentUser) return;

    if (!displayName) {
        toast({ variant: "destructive", title: "Error", description: "Display name is required." });
        return;
    }

    try {
        const userRef = doc(firestore, `users/${currentUser.id}`);
        await updateDoc(userRef, {
            displayName,
            role
        });

        toast({ title: "Success", description: `${displayName}'s profile has been updated.`});
        setIsEditDialogOpen(false);
        resetForm();
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: `Could not update profile: ${e.message}`});
    }
  }
  
  const handleOpenDeleteDialog = (user: UserProfile) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteTeamMember = async () => {
    if (!firestore || !currentUser) return;
    try {
        // This is a simplified approach. A full implementation would require a Cloud Function
        // to delete the auth user record. We are just deleting the database record, which revokes access.
        const userRef = doc(firestore, `users/${currentUser.id}`);
        await deleteDoc(userRef);
        toast({ title: "Success", description: `${currentUser.displayName} has been removed from the team.`})
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: `Could not remove user: ${e.message}`})
    } finally {
        setIsDeleteDialogOpen(false);
        resetForm();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Team Management</h1>
        <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Create a login and assign a role. The new member will use these credentials to sign in.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayNameAdd" className="text-right">Display Name</Label>
                <Input id="displayNameAdd" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emailAdd" className="text-right">Email</Label>
                <Input id="emailAdd" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passwordAdd" className="text-right">Password</Label>
                <Input id="passwordAdd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" placeholder="Min. 6 characters"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Role</Label>
                 <RadioGroup value={role} onValueChange={(value: "Admin" | "Volunteer") => setRole(value)} className="col-span-3 flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Admin" id="rAddAdmin" />
                        <Label htmlFor="rAddAdmin">Admin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Volunteer" id="rAddVolunteer" />
                        <Label htmlFor="rAddVolunteer">Volunteer</Label>
                    </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTeamMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Member Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                    <DialogDescription>Update the display name and role for {currentUser?.email}.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="displayNameEdit" className="text-right">Display Name</Label>
                        <Input id="displayNameEdit" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Role</Label>
                        <RadioGroup value={role} onValueChange={(value: "Admin" | "Volunteer") => setRole(value)} className="col-span-3 flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Admin" id="rEditAdmin" />
                                <Label htmlFor="rEditAdmin">Admin</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Volunteer" id="rEditVolunteer" />
                                <Label htmlFor="rEditVolunteer">Volunteer</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpdateTeamMember}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove <span className="font-semibold">{currentUser?.displayName}</span> from the system, revoking their access.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setCurrentUser(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteTeamMember} className="bg-destructive hover:bg-destructive/90">
                        Yes, remove user
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Display Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={4} className="text-center">Loading team members...</TableCell></TableRow>}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(user)}>Edit</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => handleOpenDeleteDialog(user)}>
                    <Trash2 className="h-4 w-4"/>
                    <span className="sr-only">Delete</span>
                  </Button>
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
