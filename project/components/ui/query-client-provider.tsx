"use client";

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClient
} from "@tanstack/react-query";
import { ReactNode } from "react";

export const queryClient = new QueryClient();

interface QueryClientProviderProps {
  children: ReactNode;
}

export default function QueryClientProvider({
  children
}: QueryClientProviderProps) {
  return (
    <TanstackQueryClient client={queryClient}>{children}</TanstackQueryClient>
  );
}
