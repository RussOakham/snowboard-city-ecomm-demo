'use client'

import { useCallback, useEffect, useId, useState, useTransition } from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { type Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebounce } from '@/hooks/use-debounce'
import { sorting } from '@/lib/shopify/constants'
import { Product } from '@/lib/shopify/types/product'
import { cn, toTitleCase } from '@/lib/utils'
import { Option } from '@/types'

import ProductCard from './cards/product-card'
import { PaginationButton } from './pagers/pagination-button'
import { Button } from './ui/button'
import { Card, CardDescription } from './ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
} from './ui/sheet'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Combobox } from './combobox'

interface ProductsProps {
	products: Product[]
	pageCount: number
	categories?: Product['productType'][]
	showFilterOptions?: boolean
}

export function Products({
	products,
	categories,
	pageCount,
	showFilterOptions = true,
}: ProductsProps) {
	const id = useId()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()

	// searchParams
	const page = searchParams?.get('page') ?? '1'
	const perPage = searchParams?.get('per_page') ?? '8'
	const inStock = searchParams?.get('inStock') ?? 'true'
	const categoriesParam = searchParams?.get('categories')
	const sort = searchParams?.get('sort') ?? 'latest-desc'

	// Create Query String
	const createQueryString = useCallback(
		(params: Record<string, string | number | null>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString())

			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.entries(params)) {
				if (value === null) {
					newSearchParams.delete(key)
				} else {
					newSearchParams.set(key, String(value))
				}
			}

			return newSearchParams.toString()
		},
		[searchParams],
	)

	// Price Filter
	const [sliderTouched, setSliderTouched] = useState(false)
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
	const debouncedPrice = useDebounce(priceRange, 500)

	useEffect(() => {
		if (!sliderTouched) return
		const [min, max] = debouncedPrice
		startTransition(() => {
			const newQueryString = createQueryString({
				price_range: `${min}-${max}`,
			})

			router.replace(`${pathname}?${newQueryString}` as Route, {
				scroll: false,
			})
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedPrice])

	// Category Filter
	const [selectedCategory, setSelectedCategory] = useState<Option | null>(
		categoriesParam
			? {
					label: toTitleCase(categoriesParam.replace(/-/g, ' ')),
					value: categoriesParam,
				}
			: null,
	)

	useEffect(() => {
		startTransition(() => {
			const newQueryString = createQueryString({
				category: selectedCategory?.value ?? null,
			})

			router.replace(`${pathname}?${newQueryString}` as Route, {
				scroll: false,
			})
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory?.value])

	return (
		<section className="flex flex-col space-y-6">
			<div className="flex items-center space-x-2">
				<Sheet>
					<SheetTrigger asChild>
						{showFilterOptions ? (
							<Button
								aria-label="Filter products"
								size="sm"
								disabled={isPending}
							>
								Filter
							</Button>
						) : null}
					</SheetTrigger>
					<SheetContent className="flex flex-col">
						<SheetHeader className="px-1">Filters</SheetHeader>
						<Separator />
						<div className="flex flex-1 flex-col gap-5 overflow-hidden p-1">
							<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
								<div className="space-7-0.5">
									<Label htmlFor={`in-stock-${id}`}>In Stock</Label>
									<CardDescription>
										Only show products that are in stock
									</CardDescription>
								</div>
								<Switch
									id={`in-stock-${id}`}
									checked={inStock === 'true'}
									onCheckedChange={(value) =>
										startTransition(() => {
											router.replace(
												`${pathname}?${createQueryString({
													inStock: value ? 'true' : 'false',
												})}` as Route,
												{
													scroll: false,
												},
											)
										})
									}
									disabled={isPending}
								/>
							</div>
							<Card className="space-y-4 rounded-lg p-3">
								<h3 className="text-sm font-medium tracking-wide text-foreground">
									Price Range (£)
								</h3>
								<Slider
									variant="range"
									thickness="thin"
									defaultValue={[0, 2000]}
									max={2000}
									step={25}
									value={priceRange}
									onValueChange={(value: typeof priceRange) => {
										setPriceRange(value)
										setSliderTouched(true)
									}}
								/>
								<div className="flex items-center space-x-4">
									<Input
										type="number"
										inputMode="numeric"
										min={0}
										max={priceRange[1]}
										value={priceRange[0]}
										onChange={(e) => {
											const value = Number(e.target.value)
											setPriceRange([value, priceRange[1]])
										}}
									/>
									<span className="text-muted-foreground">-</span>
									<Input
										type="number"
										inputMode="numeric"
										min={priceRange[0]}
										max={2000}
										value={priceRange[1]}
										onChange={(e) => {
											const value = Number(e.target.value)
											setPriceRange([priceRange[0], value])
										}}
									/>
								</div>
							</Card>
							{categories?.length ? (
								<Card className="space-y-4 rounded-lg p-3">
									<h3 className="text-sm font-medium tracking-wide text-foreground">
										Categories
									</h3>
									<Combobox
										label="category"
										labelPlural="categories"
										selected={selectedCategory}
										setSelected={setSelectedCategory}
										options={categories.map((category) => ({
											label: toTitleCase(category.replace(/-/g, ' ')),
											value: category,
										}))}
									/>
								</Card>
							) : null}
						</div>
						<div>
							<Separator className="my-4" />
							<SheetFooter>
								<Button
									aria-label="Clear filters"
									size="sm"
									className="w-full"
									onClick={() => {
										startTransition(() => {
											router.replace(`${pathname}` as Route, {
												scroll: false,
											})
										})

										setPriceRange([0, 2000])
										setSelectedCategory(null)
										// setSliderTouched(false)
									}}
									disabled={isPending}
								>
									Clear Filters
								</Button>
							</SheetFooter>
						</div>
					</SheetContent>
				</Sheet>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button aria-label="Sort products" size="sm" disabled={isPending}>
							Sort
							<ChevronDownIcon className="ml-2 size-4" aria-hidden="true" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48">
						<DropdownMenuLabel>Sort by</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{sorting.map((sortItem) => (
							<DropdownMenuItem
								key={sortItem.slug}
								className={cn(sortItem.slug === sort && 'bg-accent font-bold')}
								onClick={() => {
									startTransition(() => {
										router.replace(
											`${pathname}?${createQueryString({
												sort: sortItem.slug,
											})}` as Route,
											{
												scroll: false,
											},
										)
									})
								}}
							>
								{sortItem.title}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{!isPending && !products.length ? (
				<div className="max-w-s mx-auto flex flex-col space-y-1.5">
					<h1 className="text-center text-2xl font-bold">No products found</h1>
					<p className="text-center text-muted-foreground">
						Try changing your filters, or check back later for new products
					</p>
				</div>
			) : null}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			{products.length ? (
				<PaginationButton
					pageCount={pageCount}
					page={page}
					perPage={perPage}
					sort={sort}
					createQueryString={createQueryString}
				/>
			) : null}
		</section>
	)
}
