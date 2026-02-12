"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProvider } from "@/lib/contexts/settings-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="portfolio-theme"
      >
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>{children}</SettingsProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
