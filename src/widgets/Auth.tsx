"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Leaf, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { SignupRole } from "../types/garden";
import { useRouter } from "next/navigation";
import Link from "next/link";

//
// ✅ Zod schemas
//
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["visitor", "owner"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

//
// ✅ Component
//
const Auth = () => {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [tab, setTab] = useState("login");

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "visitor" },
  });

  //
  // ✅ Handlers
  //
  const onLogin = (data: LoginFormData) => {
    const success = login(data.email, data.password);
    if (success) {
      toast.success("Welcome back!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const onSignup = (data: SignupFormData) => {
    const success = signup(data.name, data.email, data.password, data.role);
    if (success) {
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } else {
      toast.error("Email already exists");
    }
  };

  //
  // ✅ Render
  //
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">GardenBook</h1>
          </div>

          <Tabs defaultValue="login" value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    {...loginRegister("email")}
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-xs">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    {...loginRegister("password")}
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-xs">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Sign In
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Demo: Use any email from mock data (e.g.,
                  john.doe@example.com)
                </p>
              </form>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup">
              <form
                onSubmit={handleSignupSubmit(onSignup)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="John Doe"
                    {...signupRegister("name")}
                  />
                  {signupErrors.name && (
                    <p className="text-red-500 text-xs">
                      {signupErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    {...signupRegister("email")}
                  />
                  {signupErrors.email && (
                    <p className="text-red-500 text-xs">
                      {signupErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-role">I want to</Label>
                  <Select
                    value={watch("role") as SignupRole}
                    onValueChange={(val) => setValue("role", val as SignupRole)}
                  >
                    <SelectTrigger id="signup-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitor">Visit gardens</SelectItem>
                      <SelectItem value="owner">Host a garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    {...signupRegister("password")}
                  />
                  {signupErrors.password && (
                    <p className="text-red-500 text-xs">
                      {signupErrors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    {...signupRegister("confirmPassword")}
                  />
                  {signupErrors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {signupErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
