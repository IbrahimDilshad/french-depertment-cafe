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
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthSuccess = (user: User) => {
    toast({ title: 'Success', description: `Logged in as ${user.email}` });
    if (user.email === 'ibrahimzdilshad@gmail.com') {
      router.push('/admin');
    } else {
      router.push('/volunteer');
    }
  };

  const handleEmailAuth = async () => {
    if (!auth || !firestore) return;
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create a user profile document in Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          displayName: user.email?.split('@')[0] || 'New User',
          email: user.email,
          photoURL: user.photoURL
        });
        handleAuthSuccess(user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        handleAuthSuccess(userCredential.user);
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
            {isSignUp ? 'Créer un compte' : 'Espace Membre'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSignUp ? 'Créez un nouveau compte pour commencer.' : 'Connectez-vous pour accéder à votre tableau de bord.'}
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Inscription' : 'Connexion'}</CardTitle>
            <CardDescription>
              {isSignUp ? "Entrez votre e-mail et votre mot de passe pour vous inscrire." : "Entrez vos identifiants ci-dessous."}
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
                    <Mail className="mr-2 h-4 w-4"/> {isSignUp ? "S'inscrire avec E-mail" : "Se connecter avec E-mail"}
                </Button>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="w-full">
              {isSignUp ? 'Vous avez déjà un compte? Se connecter' : "Vous n'avez pas de compte? S'inscrire"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
