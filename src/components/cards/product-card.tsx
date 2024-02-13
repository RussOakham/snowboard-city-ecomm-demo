import { useState } from 'react'
import { CheckIcon, EyeOpenIcon, PlusIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'

import { Product } from '@/lib/shopify/types/product'
import { cn } from '@/lib/utils'

import { Icons } from '../icons'
import PlaceholderImage from '../placeholder-image'
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
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)

	function mockPromise() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(console.log('added to cart'))
				setIsAddingToCart(false)
			}, 1000)
		})
	}

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
					<CardDescription className="line-clamp-1">
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
							onClick={async () => {
								setIsAddingToCart(true)
								await mockPromise()
							}}
							disabled={isAddingToCart}
						>
							{isAddingToCart && (
								<Icons.Spinner
									className="mr-2 size-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							Add to cart
						</Button>
						<Link
							href={`/preview/product/${product.handle}`}
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
						onClick={async () => {
							setIsAddingToCart(true)
							await mockPromise()
						}}
						disabled={isAddingToCart}
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
