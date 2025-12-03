
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import Logo from '@/components/logo';
import { useAuth, useFirestore } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/lib/types';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleAuthSuccess = async (user: User) => {
    if (!firestore) return;
    
    const userDocRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    let userRole: UserProfile['role'] = 'volunteer'; // Default role

    // Special handling for the super admin email
    if (user.email === 'ibrahimzdilshad@gmail.com') {
      userRole = 'admin';
      if (!docSnap.exists()) {
        const adminProfile: Omit<UserProfile, 'id'> = {
          displayName: user.email!.split('@')[0],
          email: user.email!,
          role: 'admin',
        };
        await setDoc(userDocRef, adminProfile);
      }
    } else if (docSnap.exists()) {
      const userProfile = docSnap.data() as UserProfile;
      userRole = userProfile.role;
    } else {
       // This case is for any other new user, should not happen with sign-up removed,
       // but as a safeguard, we create a volunteer profile.
       const newUserProfile: Omit<UserProfile, 'id'> = {
        displayName: user.email!.split('@')[0],
        email: user.email!,
        role: 'volunteer',
      };
      await setDoc(userDocRef, newUserProfile);
    }
    
    toast({ title: 'Success', description: `Logged in as ${user.email}` });

    if (userRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/volunteer');
    }
  };

  const handleLogin = async () => {
    if (!auth || !email || !password) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please enter both email and password.",
        });
        return;
    }
    try {
      // Try to sign in first.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(userCredential.user);
    } catch (error: any) {
      // If sign-in fails because the user doesn't exist, and it's the admin email, create the account.
      if (error.code === 'auth/user-not-found' && email === 'ibrahimzdilshad@gmail.com') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await handleAuthSuccess(userCredential.user);
        } catch (creationError: any)
{
          toast({
            variant: 'destructive',
            title: 'Admin Creation Failed',
            description: creationError.message,
          });
        }
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
         toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: "Invalid email or password.",
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Logo className="justify-center mb-4"/>
          <h1 className="text-3xl font-headline text-primary">
            Member Area
          </h1>
          <p className="mt-2 text-muted-foreground">
            Log in to access your dashboard.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button onClick={handleLogin} className="w-full">
              <Mail className="mr-2 h-4 w-4"/> Login with Email
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
