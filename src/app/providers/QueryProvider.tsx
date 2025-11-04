"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "../../components/ui/sonner";
import { useState } from "react";
import { Toaster } from "../../components/ui/toaster";
import { TooltipProvider } from "../../components/ui/tooltip";
import { AuthProvider } from "../../context/AuthContext";

export function QueryProviders({ children }: { children: React.ReactNode }) {
  // ✅ Create QueryClient inside useState to ensure it's stable between renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster />
          <Sonner position="top-right" richColors/>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
