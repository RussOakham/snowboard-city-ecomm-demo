'use client'

import { useCallback, useEffect, useId, useState, useTransition } from 'react'
import { type Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebounce } from '@/hooks/use-debounce'
import { Product } from '@/lib/shopify/types/product'
import { toTitleCase } from '@/lib/utils'
import { Option } from '@/types'

import { Button } from './ui/button'
import { Card, CardDescription } from './ui/card'
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
	// products: Product[]
	// pageCount: number
	// category?: Product['productType']
	categories?: Product['productType'][]
	// storePageCount?: number
}

export function Products({ categories }: ProductsProps) {
	const id = useId()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()

	// searchParams
	const inStock = searchParams?.get('inStock') ?? 'true'
	const categoriesParam = searchParams?.get('categories')

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
						<Button aria-label="Filter products" size="sm" disabled={isPending}>
							Filter
						</Button>
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
										setSliderTouched(false)
									}}
									disabled={isPending}
								>
									Clear Filters
								</Button>
							</SheetFooter>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</section>
	)
}
