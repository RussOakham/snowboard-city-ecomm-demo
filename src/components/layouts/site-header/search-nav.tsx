'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const searchInputSchema = z.object({
	search: z.string(),
})

type SearchInput = z.infer<typeof searchInputSchema>

export function SearchNav() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const initialSearchValue = searchParams.get('search') ?? ''

	const form = useForm<SearchInput>({
		resolver: zodResolver(searchInputSchema),
		defaultValues: {
			search: initialSearchValue,
		},
	})

	function onSubmit(query: SearchInput) {
		router.push(`/search?query=${query.search}`, {
			scroll: false,
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex">
				<FormField
					name="search"
					control={form.control}
					render={({ field }) => (
						<FormControl>
							<Input
								type="text"
								inputMode="search"
								autoComplete="off"
								placeholder={searchParams.get('search') ?? 'Search products...'}
								className="rounded-r-none border-r-transparent focus-visible:ring-0"
								{...field}
								onChange={(e) => {
									const { value } = e.target
									field.onChange(value)
								}}
							/>
						</FormControl>
					)}
				/>
				<Button
					type="submit"
					aria-label="Search products"
					className="rounded-l-none border-l-transparent"
					variant="outline"
				>
					<MagnifyingGlassIcon className="size-4" aria-hidden="true" />
					<span className="sr-only">Search products</span>
				</Button>
			</form>
		</Form>
	)
}
