'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { ErrorCard } from '@/components/cards/error-card'
import { Shell } from '@/components/layouts/shells/shell'

interface ErrorProps {
	error?: Error & { digest?: string }
	reset?: () => void
}

export default function Error({ error, reset }: ErrorProps) {
	const pathname = usePathname()

	useEffect(() => {
		// eslint-disable-next-line no-console
		console.error(`Error in ${pathname}`, error)
	}, [error, pathname])

	return (
		<Shell variant="centered" className="max-w-md">
			<ErrorCard
				title="Oops something went wrong!"
				description="There was an error processing your request. Please try again later."
				reset={reset}
			/>
		</Shell>
	)
}
