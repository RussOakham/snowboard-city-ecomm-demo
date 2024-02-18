'use client'

import React from 'react'
import { MinusIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

import { useRemoveItemMutation } from '@/lib/react-query/mutations/useRemoveItemMutation'
import { useUpdateItemQuantityMutation } from '@/lib/react-query/mutations/useUpdateItemQuantity'
import { CartItem } from '@/lib/shopify/types/cart'
import { catchError } from '@/lib/utils'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface UpdateCartProps {
	cartLineItem: CartItem
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
	const id = React.useId()
	const [isPending, startTransition] = React.useTransition()
	const removeItemMutation = useRemoveItemMutation()
	const updateItemQuantityMutation = useUpdateItemQuantityMutation()

	const cartId = Cookies.get('cartId')

	return (
		<div className="xs:w-auto xs:justify-normal mb-2 flex w-full items-center justify-between space-x-2">
			<div className="flex items-center">
				<Button
					id={`${id}-decrement`}
					variant="outline"
					size="icon"
					className="size-8 rounded-r-none"
					onClick={() => {
						startTransition(() => {
							updateItemQuantityMutation.mutate(
								{
									prevState: null,
									payload: {
										lineId: cartLineItem.id,

										variantId: cartLineItem.merchandise.id,
										quantity: cartLineItem.quantity - 1,
									},
									cartId,
								},
								{
									onError: (err) => {
										catchError(err)
									},
								},
							)
						})
					}}
					disabled={cartLineItem.quantity === 0}
				>
					<MinusIcon className="size-3" aria-hidden="true" />
					<span className="sr-only">Remove Item</span>
				</Button>
				<Input
					id={`${id}-quantity`}
					type="number"
					min={0}
					className="pointer-events-none h-8 w-10 rounded-none border-x-0 text-center"
					value={cartLineItem.quantity}
					onChange={(e) => {
						startTransition(() => {
							updateItemQuantityMutation.mutate(
								{
									prevState: null,
									payload: {
										lineId: cartLineItem.id,
										variantId: cartLineItem.merchandise.id,
										quantity: Number(e.target.value),
									},
									cartId,
								},
								{
									onError: (err) => {
										catchError(err)
									},
								},
							)
						})
					}}
					disabled={isPending}
				/>
				<Button
					id={`${id}-increment`}
					variant="outline"
					size="icon"
					className="size-8 rounded-l-none"
					onClick={() => {
						startTransition(() => {
							updateItemQuantityMutation.mutate(
								{
									prevState: null,
									payload: {
										lineId: cartLineItem.id,
										variantId: cartLineItem.merchandise.id,
										quantity: cartLineItem.quantity + 1,
									},
									cartId,
								},
								{
									onError: (err) => {
										catchError(err)
									},
								},
							)
						})
					}}
					disabled={isPending}
				>
					<PlusIcon className="size-3" aria-hidden="true" />
					<span className="sr-only">Add Item</span>
				</Button>
				<Button
					id={`${id}-remove`}
					variant="outline"
					size="icon"
					className="ml-2 size-8"
					onClick={() => {
						startTransition(() => {
							if (!cartLineItem.id) {
								throw new Error('Missing cart line item ID')
							}
							removeItemMutation.mutate(
								{
									prevState: null,
									cartId,
									cartLineItem,
								},
								{
									onSuccess: () => {
										toast.success(
											`${cartLineItem.merchandise.product.title} removed from cart`,
										)
									},
									onError: (err) => {
										catchError(err)
									},
								},
							)
						})
					}}
					disabled={isPending}
				>
					<TrashIcon className="size-3" aria-hidden="true" />
					<span className="sr-only">Remove Item</span>
				</Button>
			</div>
		</div>
	)
}
