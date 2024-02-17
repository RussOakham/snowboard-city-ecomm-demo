'use client'

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

import Error from '@/app/(home)/_components.tsx/Error'

interface MyErrorInfo {
	componentStack?: string | null | undefined
}

interface ErrorBoundaryProps {
	children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
	const logError = (error: Error, info: MyErrorInfo) => {
		// eslint-disable-next-line no-console
		console.error(error, info)
	}

	return (
		<ReactErrorBoundary fallback={<Error />} onError={logError}>
			{children}
		</ReactErrorBoundary>
	)
}
