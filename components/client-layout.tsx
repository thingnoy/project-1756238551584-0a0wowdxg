'use client'

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { DemoDataProvider } from "@/components/demo-data";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <ThemeProvider>
      <DemoDataProvider>
        {mounted && (
          <div className="fixed top-6 right-6 z-50">
            <ThemeToggle />
          </div>
        )}
        {children}
      </DemoDataProvider>
    </ThemeProvider>
  )
}