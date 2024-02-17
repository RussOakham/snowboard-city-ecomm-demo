import React from 'react'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { Route } from 'next'
import Link from 'next/link'

import { cn, truncate } from '@/lib/utils'

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
	segments: {
		title: string
		href: string
	}[]
	separator?: React.ComponentType<{ className?: string }>
	truncationLength?: number
}

export function Breadcrumbs({
	segments,
	separator,
	truncationLength = 0,
	className,
	...props
}: BreadcrumbProps) {
	const SeparatorIcon = separator ?? ChevronRightIcon

	return (
		<nav
			aria-label="breadcrumbs"
			className={cn(
				'flex w-full items-center overflow-auto text-sm font-medium text-muted-foreground',
				className,
			)}
			{...props}
		>
			{segments.map((segment, i) => {
				const isLastSegment = i === segments.length - 1

				return (
					<React.Fragment key={segment.href}>
						<Link
							href={segment.href as Route}
							aria-current={isLastSegment ? 'page' : undefined}
							className={cn(
								'truncate transition-colors hover:text-foreground',
								isLastSegment ? 'text-foreground' : 'text-muted-foreground',
							)}
						>
							{truncationLength > 0 && segment.title
								? truncate(segment.title, truncationLength)
								: segment.title}
						</Link>
						{!isLastSegment && (
							<SeparatorIcon className="mx-2 size-4" aria-hidden="true" />
						)}
					</React.Fragment>
				)
			})}
		</nav>
	)
}
