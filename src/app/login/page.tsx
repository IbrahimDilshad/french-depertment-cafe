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
import { Shield, Users } from 'lucide-react';
import Logo from '@/components/logo';

export default function LoginPage() {
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
              <Input id="email" type="email" placeholder="nom@exemple.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required />
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
