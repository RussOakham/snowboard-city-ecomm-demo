'use client'

import { useRef } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DialogShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogShell({
	children,
	className,
	...props
}: DialogShellProps) {
	const shellRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	return (
		<div ref={shellRef} className={cn(className)} {...props}>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-4 top-4 size-auto shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
				onClick={() => router.back()}
			>
				<Cross2Icon className="size-4" aria-hidden="true" />
				<span className="sr-only">Close</span>
			</Button>
			{children}
		</div>
	)
}
