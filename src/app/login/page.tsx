"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Users, Mail } from 'lucide-react';
import Logo from '@/components/logo';
import { useAuth } from '@/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async () => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      // Redirect to a protected route
      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Success', description: 'Logged in with Google successfully!' });
      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Login Failed',
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
              Entrez vos identifiants ci-dessous ou utilisez un fournisseur.
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
                <Button onClick={handleEmailLogin}>
                    <Mail className="mr-2 h-4 w-4"/> Se connecter avec E-mail
                </Button>
                <Button variant="outline" onClick={handleGoogleLogin}>
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177 56.5L357 187.6c-27.1-25.5-62.2-41-100.2-41-83.3 0-151.8 68.5-151.8 151.8s68.5 151.8 151.8 151.8c90.1 0 138.8-63.8 143.4-93.5H248v-85.3h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path></svg>
                  Se connecter avec Google
                </Button>
            </div>
             <div className="flex flex-col space-y-2 pt-2">
                <Button asChild>
                    <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4"/> Se connecter en tant qu'administrateur
                    </Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/volunteer">
                        <Users className="mr-2 h-4 w-4"/> Se connecter en tant que bénévole
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
