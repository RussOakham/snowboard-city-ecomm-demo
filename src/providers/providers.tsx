'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'

// Custom QueryClient implementation based upon following GH issue:
// https://github.com/TanStack/query/issues/6116
// Fixes bug where can get stuck in and infinite loop on initial render, as server and client query clients are not synced
function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 60 * 1,
				refetchOnReconnect: false,
				refetchOnMount: false,
			},
		},
	})
}

// eslint-disable-next-line no-undef-init
let clientQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
	if (typeof window === 'undefined') {
		// Server: always make a new query client
		return makeQueryClient()
		// eslint-disable-next-line no-else-return
	} else {
		// Browser: make a new query client if we don't already have one
		if (!clientQueryClient) clientQueryClient = makeQueryClient()
		return clientQueryClient
	}
}

interface ProviderProps {
	children: React.ReactNode
}

export default function Providers({ children }: ProviderProps) {
	const queryClient = getQueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
				</ThemeProvider>
			</ReactQueryStreamedHydration>
			<ReactQueryDevtools initialIsOpen={false} />
			<Toaster />
		</QueryClientProvider>
	)
}
