import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* FOOTER — appears only at bottom when scrolled */}
        <footer className="mt-32 mb-8 text-center space-y-4">

          {/* Poetic line — animated */}
          <div className="inline-flex items-center gap-3 text-muted-foreground/30 font-mono text-xs tracking-wider glow-text animate-fade-in-delayed">
            <span className="w-8 h-px bg-border/50" />
            <span>No accounts. No history. Just release.</span>
            <span className="w-8 h-px bg-border/50" />
          </div>

          {/* Policy links — static */}
          <div className="text-muted-foreground/40 text-[11px]">
            <a href="/privacy-policy.html" className="mx-2">Privacy Policy</a> ·
            <a href="/terms.html" className="mx-2">Terms</a> ·
            <a href="/contact.html" className="mx-2">Contact</a>
          </div>

        </footer>
      </BrowserRouter>

      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
