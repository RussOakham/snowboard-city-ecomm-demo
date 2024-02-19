import { useMemo, useTransition } from 'react'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

interface PaginationButtonProps extends React.HTMLAttributes<HTMLDivElement> {
	pageCount: number
	page?: string
	perPage?: string
	sort?: string
	createQueryString: (params: Record<string, string | number | null>) => string
	siblingCount?: number
}

export function PaginationButton({
	pageCount,
	page,
	perPage,
	sort,
	createQueryString,
	siblingCount = 1,
	className,
	...props
}: PaginationButtonProps) {
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	// Memoize pagination range to avoid unnecessary re-renders
	const paginationRange = useMemo(() => {
		const delta = siblingCount + 2

		const range = []

		for (
			let i = Math.max(2, Number(page) - delta);
			i <= Math.min(pageCount - 1, Number(page) + delta);
			i += 1
		) {
			range.push(i)
		}

		if (Number(page) - delta > 2) {
			range.unshift('...')
		}
		if (Number(page) + delta < pageCount - 1) {
			range.push('...')
		}

		return range
	}, [page, pageCount, siblingCount])

	return (
		<div
			className={cn(
				'flex flex-wrap items-center justify-center gap-2',
				className,
			)}
			{...props}
		>
			<Button
				aria-label="Go to first page"
				variant="outline"
				size="icon"
				className="hidden size-8 lg:flex"
				onClick={() => {
					startTransition(() => {
						router.replace(
							`${pathname}?${createQueryString({ page: 1, per_page: perPage ?? null, sort: sort ?? null })}` as Route,
						)
					})
				}}
				disabled={Number(page) === 1 || !isPending}
			>
				<DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
			</Button>
			<Button
				aria-label="Go to previous page"
				variant="outline"
				size="icon"
				className="size-8"
				onClick={() => {
					startTransition(() => {
						router.replace(
							`${pathname}?${createQueryString({
								page: Number(page) - 1,
								per_page: perPage ?? null,
								sort: sort ?? null,
							})}` as Route,
						)
					})
				}}
				disabled={Number(page) === 1 || isPending}
			>
				<ChevronLeftIcon className="size-4" aria-hidden="true" />
			</Button>
			{paginationRange.map((pageNumber) =>
				pageNumber === '...' ? (
					<Button
						aria-label="Page separator"
						key={pageNumber}
						variant="outline"
						size="icon"
						className="size-8"
						disabled
					>
						...
					</Button>
				) : (
					<Button
						aria-label={`Page ${pageNumber}`}
						key={pageNumber}
						variant={Number(page) === pageNumber ? 'default' : 'outline'}
						size="icon"
						className="size-8"
						onClick={() => {
							startTransition(() => {
								router.replace(
									`${pathname}?${createQueryString({
										page: pageNumber,
										per_page: perPage ?? null,
										sort: sort ?? null,
									})}` as Route,
								)
							})
						}}
						disabled={isPending}
					>
						{pageNumber}
					</Button>
				),
			)}

			<Button
				aria-label="Go to next page"
				variant="outline"
				size="icon"
				className="size-8"
				onClick={() => {
					startTransition(() => {
						router.replace(
							`${pathname}?${createQueryString({
								page: Number(page) + 1,
								per_page: perPage ?? null,
								sort: sort ?? null,
							})}` as Route,
						)
					})
				}}
				disabled={Number(page) === (pageCount ?? 10) || isPending}
			>
				<ChevronRightIcon className="size-4" aria-hidden="true" />
			</Button>
			<Button
				aria-label="Go to last page"
				variant="outline"
				size="icon"
				className="hidden size-8 lg:flex"
				onClick={() => {
					router.replace(
						`${pathname}?${createQueryString({
							page: pageCount ?? 10,
							per_page: perPage ?? null,
							sort: sort ?? null,
						})}` as Route,
					)
				}}
				disabled={Number(page) === (pageCount ?? 10) || isPending}
			>
				<DoubleArrowRightIcon className="size-4" aria-hidden="true" />
			</Button>
		</div>
	)
}
