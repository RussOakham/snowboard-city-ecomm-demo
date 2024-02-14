import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { addItem, addItems } from '@/lib/actions/cart'
import { updateCartItemFormSchema } from '@/lib/shopify/schemas/cart.schema'
import { ProductVariant } from '@/lib/shopify/types/product'
import { catchError, cn } from '@/lib/utils'

import { Icons } from '../icons'
import { Button } from '../ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

interface AddToCartFormProps {
	variants: ProductVariant[]
	availableForSale: boolean
	showBuyNow?: boolean
}

type Inputs = z.infer<typeof updateCartItemFormSchema>

export function AddToCartForm({
	variants,
	availableForSale,
	showBuyNow,
}: AddToCartFormProps) {
	const id = React.useId()
	const router = useRouter()
	const [isAddingToCart, startAddingToCart] = React.useTransition()
	const [isBuyingNow, startBuyingNow] = React.useTransition()
	const searchParams = useSearchParams()

	const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined
	const variant = variants.find((v: ProductVariant) =>
		v.selectedOptions.every(
			(option) => option.value === searchParams.get(option.name.toLowerCase()),
		),
	)
	const selectedVariantId = variant?.id ?? defaultVariantId

	function onSubmit(data: Inputs) {
		startAddingToCart(async () => {
			try {
				await addItems(null, selectedVariantId, data.quantity)
				toast.success('Item added to cart')
			} catch (err) {
				catchError(err)
			}
		})
	}

	const form = useForm<Inputs>({
		resolver: zodResolver(updateCartItemFormSchema),
		defaultValues: {
			quantity: 1,
		},
	})

	const OutOfStockButton = (
		<div className="flex items-center">
			<Button
				id={`${id}-decrement`}
				type="button"
				variant="outline"
				size="icon"
				className="size-8 w-full shrink-0 rounded-r-none"
				aria-disabled
				disabled
			>
				Out of Stock
			</Button>
		</div>
	)

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn(
					'flex max-w-[260px] gap-4',
					showBuyNow ? 'flex-col' : 'flex-row',
				)}
			>
				{!availableForSale ? (
					OutOfStockButton
				) : (
					<>
						<div className="flex items-center">
							<Button
								id={`${id}-decrement`}
								type="button"
								variant="default"
								size="icon"
								className="size-8 shrink-0 self-end rounded-r-none"
								onClick={() => {
									form.setValue('quantity', form.getValues('quantity') - 1)
								}}
								disabled={isAddingToCart}
							>
								<MinusIcon className="size-3" aria-hidden="true" />
								<span className="sr-only">Remove item</span>
							</Button>
							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem className="space-y-0 text-center">
										<FormLabel>Quantity</FormLabel>
										<FormControl>
											<Input
												type="number"
												inputMode="numeric"
												min={0}
												className="h-8 w-16 rounded-none border-x-0"
												{...field}
												onChange={(e) => {
													const { value } = e.target
													const parsedValue = parseInt(value, 10)
													if (Number.isNaN(parsedValue)) return
													field.onChange(parsedValue)
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								id={`${id}-increment`}
								type="button"
								variant="default"
								size="icon"
								className="size-8 shrink-0 self-end rounded-l-none"
								onClick={() => {
									form.setValue('quantity', form.getValues('quantity') + 1)
								}}
								disabled={isAddingToCart}
							>
								<PlusIcon className="size-3" aria-hidden="true" />
								<span className="sr-only">Add item</span>
							</Button>
						</div>
						<div className="flex items-center space-x-2.5">
							{showBuyNow ? (
								<Button
									type="button"
									aria-label="Buy now"
									size="sm"
									className="w-full"
									onClick={() => {
										startBuyingNow(async () => {
											try {
												await addItem(null, selectedVariantId)
												router.push('/cart')
											} catch (err) {
												catchError(err)
											}
										})
									}}
									disabled={isBuyingNow}
								>
									{isBuyingNow ? (
										<Icons.Spinner
											className="mr-2 size-4 animate-spin"
											aria-hidden="true"
										/>
									) : null}
									Buy now
								</Button>
							) : null}
							<Button
								type="submit"
								aria-label="Add to cart"
								variant={showBuyNow ? 'outline' : 'default'}
								size="sm"
								className="w-full"
								disabled={isAddingToCart}
							>
								{isAddingToCart ? (
									<Icons.Spinner
										className="mr-2 size-4 animate-spin"
										aria-hidden="true"
									/>
								) : null}
								Add to cart
							</Button>
						</div>
					</>
				)}
			</form>
		</Form>
	)
}
