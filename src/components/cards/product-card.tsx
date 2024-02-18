'use client'

import { useState, useTransition } from 'react'
import { CheckIcon, EyeOpenIcon, PlusIcon } from '@radix-ui/react-icons'
import Cookies from 'js-cookie'
import { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLogger } from 'next-axiom'
import { toast } from 'sonner'

import { useAddItemMutation } from '@/lib/react-query/mutations/useAddItemMutation'
import { Product, ProductVariant } from '@/lib/shopify/types/product'
import { catchError, cn } from '@/lib/utils'

import { Icons } from '../icons'
import { PlaceholderImage } from '../placeholder-image'
import { AspectRatio } from '../ui/aspect-ratio'
import { Button, buttonVariants } from '../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface CardActionButtonProps {
	isAddedToCart: boolean
}

const CartActionButton = ({ isAddedToCart }: CardActionButtonProps) => {
	if (isAddedToCart)
		return <CheckIcon className="mr-2 size-4" aria-hidden="true" />

	return <PlusIcon className="mr-2 size-4" aria-hidden="true" />
}

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
	product: Product
	variant?: 'default' | 'switchable'
	isAddedToCart?: boolean
	onSwitch?: () => Promise<void>
}

const ProductCard = ({
	product,
	variant = 'default',
	isAddedToCart = false,
	onSwitch,
	className,
	...props
}: ProductCardProps) => {
	// Change to useTransition with server action? Or keep same with React Query
	const searchParams = useSearchParams()
	const [isAddingToCart, startAddingToCart] = useTransition()
	const [imageLoaded, setImageLoaded] = useState(false)
	const addItemMutation = useAddItemMutation()
	const log = useLogger()

	const cartId = Cookies.get('cartId')

	const productVariant = product.variants.find((v: ProductVariant) =>
		v.selectedOptions.every(
			(option) => option.value === searchParams.get(option.name.toLowerCase()),
		),
	)
	const selectedVariantId = productVariant?.id ?? product.variants[0]?.id

	return (
		<Card
			className={cn('size-full overflow-hidden rounded-sm', className)}
			{...props}
		>
			<Link aria-label={product.title} href={`/product/${product.handle}`}>
				<CardHeader className="border-b p-0">
					<AspectRatio ratio={4 / 3}>
						{product.images?.length ? (
							<>
								<Image
									src={
										product.images[0]?.url ?? '/images/product-placeholder.webp'
									}
									alt={product.images[0]?.altText ?? product.title}
									className={`${!imageLoaded ? 'opacity-0' : 'opacity-100'} object-cover`}
									sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
									fill
									loading="lazy"
									onLoad={() => setImageLoaded(true)}
								/>
								{!imageLoaded && <Skeleton className="h-full w-full" />}
							</>
						) : (
							<PlaceholderImage className="rounded-none" asChild />
						)}
					</AspectRatio>
				</CardHeader>
				<span className="sr-only">{product.title}</span>
			</Link>
			<Link href={`/product/${product.handle}`} tabIndex={0}>
				<CardContent className="space-y-1.5 p-4">
					<CardTitle className="line-clamp-1">{product.title}</CardTitle>
					<CardDescription className="line-clamp-1 md:h-5">
						{product.description}
					</CardDescription>
				</CardContent>
			</Link>
			<CardFooter className="p-4 pt-1">
				{variant === 'default' ? (
					<div className="flex w-full items-center space-x-2">
						<Button
							aria-label="Add to cart"
							size="sm"
							className="h-8 w-full rounded-sm"
							variant={product.availableForSale ? 'default' : 'destructive'}
							onClick={() => {
								startAddingToCart(() => {
									// await addItem(null, selectedVariantId)
									addItemMutation.mutate(
										{
											prevState: null,
											selectedVariantId,
											product,
											cartId,
										},
										{
											onSuccess: () => {
												toast.success(`${product.handle} added to cart`)
											},
											onError: (err) => {
												catchError(err)
												log.error('Error adding to cart', err)
											},
										},
									)
								})
							}}
							disabled={isAddingToCart || !product.availableForSale}
						>
							{isAddingToCart && (
								<Icons.Spinner
									className="mr-2 size-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							{product.availableForSale ? 'Add to cart' : 'Out of stock'}
						</Button>
						<Link
							href={`/preview/product/${product.handle}` as Route}
							title="Preview"
							className={cn(
								buttonVariants({
									variant: 'secondary',
									size: 'icon',
									className: 'h-8 w-8 shrink-0',
								}),
							)}
						>
							<EyeOpenIcon className="size-4" aria-hidden="true" />
							<span className="sr-only">Preview</span>
						</Link>
					</div>
				) : (
					<Button
						aria-label={isAddedToCart ? 'Remove from cart' : 'Add to cart'}
						size="sm"
						className="h-8 w-full rounded-sm"
						onClick={() => {
							startAddingToCart(() => {
								// await addItem(null, selectedVariantId)
								if (!selectedVariantId) {
									throw new Error('Missing product variant ID')
								}
								addItemMutation.mutate(
									{
										prevState: null,
										selectedVariantId,
										product,
										cartId,
									},
									{
										onSuccess: () => {
											toast.success(`${product.title} added to cart`)
										},
										onError: (err) => {
											catchError(err)
											log.error('Error adding to cart', err)
										},
									},
								)
							})
						}}
						disabled={isAddingToCart || !product.availableForSale}
					>
						{isAddingToCart ? (
							<Icons.Spinner
								className="mr-2 size-4 animate-spin"
								aria-hidden="true"
							/>
						) : (
							<CartActionButton isAddedToCart={isAddedToCart} />
						)}
						{isAddedToCart ? 'Added' : 'Add to cart'}
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}

export default ProductCard
