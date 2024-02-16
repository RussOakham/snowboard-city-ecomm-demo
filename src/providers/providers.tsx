'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

import { Toaster } from '@/components/ui/sonner'

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
			<ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
			<ReactQueryDevtools initialIsOpen={false} />
			<Toaster />
		</QueryClientProvider>
	)
}
