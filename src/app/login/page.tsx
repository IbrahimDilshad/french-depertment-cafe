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
import { Mail, ShieldCheck } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const handleAuthSuccess = async (user: User) => {
    if (!firestore) return;
    
    const userDocRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userProfile = docSnap.data() as UserProfile;
      toast({ title: 'Success', description: `Logged in as ${user.email}` });

      if (userProfile.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/volunteer');
      }
    } else {
      // This is a new user, create their profile with a default role
       const newUserProfile: Omit<UserProfile, 'id'> = {
        displayName: user.email!.split('@')[0],
        email: user.email!,
        role: 'volunteer', // Default role
      };

      await setDoc(doc(firestore, "users", user.uid), newUserProfile);
      toast({ title: 'Welcome!', description: `Account created for ${user.email}` });
      router.push('/volunteer'); // Redirect new users to volunteer page
    }
  };

  const handleAuth = async () => {
    if (!auth) return;
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential.user);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isSignUp ? 'Sign Up Failed' : 'Login Failed',
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
            <CardTitle>{isSignUp ? 'Créer un compte' : 'Connexion'}</CardTitle>
            <CardDescription>
              {isSignUp ? "Créez un nouveau compte pour commencer." : "Entrez vos identifiants ci-dessous."}
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
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button onClick={handleAuth} className="w-full">
              <Mail className="mr-2 h-4 w-4"/> {isSignUp ? "S'inscrire avec E-mail" : "Se connecter avec E-mail"}
            </Button>
            <div className="flex items-center space-x-2">
              <Label htmlFor="mode-switch">Connexion</Label>
              <Switch id="mode-switch" checked={isSignUp} onCheckedChange={setIsSignUp} />
              <Label htmlFor="mode-switch">S'inscrire</Label>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
