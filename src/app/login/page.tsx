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
import { useAuth, useDoc, useFirestore } from '@/firebase';
import {
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
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
  
  const handleAuthSuccess = (user: User) => {
    if (!firestore) return;
    
    // We need to fetch the user's role from Firestore to decide where to redirect.
    const userDocRef = doc(firestore, "users", user.uid);
    getDoc(userDocRef).then(docSnap => {
      if (docSnap.exists()) {
        const userProfile = docSnap.data() as UserProfile;
        toast({ title: 'Success', description: `Logged in as ${user.email}` });

        if (userProfile.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/volunteer');
        }
      } else {
        // This case should ideally not happen if users are created correctly
        toast({ variant: 'destructive', title: 'Login Failed', description: 'User profile not found.' });
      }
    });
  };

  // Helper import from firestore
  const { getDoc, doc } = require("firebase/firestore");

  const handleEmailAuth = async () => {
    if (!auth) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDocRef = doc(firestore, "users", userCredential.user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
          const userProfile = docSnap.data() as UserProfile;
          toast({ title: 'Success', description: `Logged in as ${userCredential.user.email}` });
  
          if (userProfile.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/volunteer');
          }
      } else {
          // Fallback or error handling
          toast({ variant: 'destructive', title: 'Login Failed', description: 'User profile not found.' });
          router.push('/');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Logo className="justify-center mb-4"/>
          <h1 className="text-3xl font-headline text-primary">
            Espace Membre
          </h1>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous pour accéder à votre tableau de bord.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants ci-dessous.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" placeholder="nom@exemple.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-2 pt-2">
                <Button onClick={handleEmailAuth}>
                    <Mail className="mr-2 h-4 w-4"/> Se connecter avec E-mail
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
