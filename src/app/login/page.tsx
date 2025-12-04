
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useDoc } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";
import Logo from "@/components/logo";
import { UserProfile } from "@/lib/types";
import { get, ref } from "firebase/database";
import { useDatabase } from "@/firebase/provider";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useDatabase();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication service not available.",
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After successful login, fetch the user's role from Realtime Database
      const userProfileRef = ref(db, `users/${user.uid}`);
      const userProfileSnap = await get(userProfileRef);

      if (userProfileSnap.exists()) {
        const userProfile = userProfileSnap.val() as UserProfile;
        toast({
          title: "Success",
          description: "Logged in successfully. Redirecting...",
        });
        
        // Redirect based on role
        if (userProfile.role === 'Admin') {
          router.push("/admin");
        } else if (userProfile.role === 'Volunteer') {
          router.push("/volunteer");
        } else {
          // Fallback if role is not set or unexpected value
          router.push("/login");
        }
      } else {
        // This case might happen if the DB entry wasn't created
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "User profile not found. Please contact an admin.",
        });
        await auth.signOut();
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex justify-center">
            <Logo />
        </div>
        <Card>
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the management panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
