import clsx from 'clsx'
import { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ProductOption, ProductVariant } from '@/lib/shopify/types/product'

type Combination = {
	id: string
	availableForSale: boolean
	[key: string]: string | boolean
}

interface VariantSelectorProps {
	options: ProductOption[]
	variants: ProductVariant[]
}

export function VariantSelector({ options, variants }: VariantSelectorProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const hasOneOrNoOptions =
		!options.length ?? (options.length === 1 && options[0]?.values.length === 1)

	if (hasOneOrNoOptions) return null

	const combinations: Combination[] = variants.map((variant) => ({
		id: variant.id,
		availableForSale: variant.availableForSale,
		...variant.selectedOptions.reduce(
			(acc, option) => ({ ...acc, [option.name.toLowerCase()]: option.value }),
			{},
		),
	}))

	return options.map((option) => (
		<dl className="mb-8" key={option.id}>
			<dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
			<dd className="flex flex-wrap gap-3">
				{option.values.map((value) => {
					const optionNameLowercase = option.name.toLowerCase()

					// Base option params on current params so we can preserve any other param state in the url.
					const optionSearchParams = new URLSearchParams(
						searchParams.toString(),
					)

					// Update the option params using the current option to reflect how the url *would* change,
					// if the option was clicked.
					optionSearchParams.set(optionNameLowercase, value)
					const optionUrl = `${pathname}?${optionSearchParams.toString()}`

					// In order to determine if an option is available for sale, we need to:
					//
					// 1. Filter out all other param state
					// 2. Filter out invalid options
					// 3. Check if the option combination is available for sale
					//
					// This is the "magic" that will cross check possible variant combinations and preemptively
					// disable combinations that are not available. For example, if the color gray is only available in size medium,
					// then all other sizes should be disabled.

					const filtered = Array.from(optionSearchParams.entries()).filter(
						([key, filterValue]) =>
							options.find(
								(filterOption) =>
									filterOption.name.toLowerCase() === key &&
									filterOption.values.includes(filterValue),
							),
					)

					const isAvailableForSale = combinations.find((combination) =>
						filtered.every(
							([key, filterValue]) =>
								combination[key] === filterValue &&
								combination.availableForSale,
						),
					)

					// The option is active if it's in the url params.
					const isActive = searchParams.get(optionNameLowercase) === value

					return (
						<button
							type="button"
							key={value}
							aria-disabled={!isAvailableForSale}
							disabled={!isAvailableForSale}
							onClick={() => {
								router.replace(optionUrl as Route, { scroll: false })
							}}
							title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
							className={clsx(
								'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
								{
									'cursor-default ring-2 ring-blue-600': isActive,
									'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
										!isActive && isAvailableForSale,
									'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
										!isAvailableForSale,
								},
							)}
						>
							{value}
						</button>
					)
				})}
			</dd>
		</dl>
	))
}
