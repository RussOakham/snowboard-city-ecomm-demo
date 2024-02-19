import { Slot } from '@radix-ui/react-slot'
import Image from 'next/image'

import { CartItem } from '@/lib/shopify/types/cart'
import { cn, formatPrice } from '@/lib/utils'

import { Icons } from '../icons'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'

import { UpdateCart } from './update-cart'

interface CartLineItemsProps extends React.HTMLAttributes<HTMLDivElement> {
	items: CartItem[]
	isScrollable?: boolean
	isEditable?: boolean
	variant?: 'default' | 'minimal'
}

export function CartLineItems({
	items,
	isScrollable = true,
	isEditable = true,
	variant = 'default',
	className,
	...props
}: CartLineItemsProps) {
	const Component = isScrollable ? ScrollArea : Slot

	return (
		<Component className="h-full">
			<div
				className={cn(
					'flex w-full flex-col gap-5',
					isScrollable && 'pr-6',
					className,
				)}
				{...props}
			>
				{items.map((item) => {
					return (
						<div key={item.id}>
							<div
								className={cn(
									'flex items-start justify-between gap-4',
									isEditable && 'xs:flex-row flex-col',
								)}
							>
								<div className="flex items-center space-x-4">
									{variant === 'default' ? (
										<div className="relative aspect-square size-16 min-w-fit overflow-hidden rounded">
											{item.merchandise.product.featuredImage.url ? (
												<Image
													src={
														item.merchandise.product.featuredImage.url ??
														'/images/product-placeholder.webp'
													}
													alt={item.merchandise.product.title}
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
													fill
													className="absolute object-cover"
													loading="lazy"
												/>
											) : (
												<div className="flex h-full items-center justify-center bg-secondary">
													<Icons.Placeholder
														className="size-4 text-muted-foreground"
														aria-hidden="true"
													/>
												</div>
											)}
										</div>
									) : null}
									<div className="flex flex-col space-y-1 self-start">
										<span className="line-clamp-1 text-sm font-medium">
											{item.merchandise.product.title}
										</span>
										<span className="line-clamp-1 text-xs capitalize text-muted-foreground">
											{`${item.merchandise.title}`}
										</span>
										{isEditable ? (
											<span className="line-clamp-1 text-xs text-muted-foreground">
												{formatPrice(
													Number(
														item.merchandise.product.priceRange.minVariantPrice
															.amount,
													).toFixed(2),
												)}{' '}
												x {item.quantity} ={' '}
												{formatPrice(
													(
														Number(
															item.merchandise.product.priceRange
																.minVariantPrice.amount,
														) * Number(item.quantity)
													).toFixed(2),
												)}
											</span>
										) : (
											<span className="line-clamp-1 text-xs text-muted-foreground">
												Qty {item.quantity}
											</span>
										)}
										{variant === 'default' ? (
											<span className="line-clamp-1 text-xs capitalize text-muted-foreground">
												{`${item.merchandise.product.productType}`}
											</span>
										) : null}
									</div>
								</div>
								{isEditable ? (
									<UpdateCart cartLineItem={item} />
								) : (
									<div className="flex flex-col space-y-1 font-medium">
										<span className="ml-auto line-clamp-1 text-sm">
											{formatPrice(
												(
													Number(
														item.merchandise.product.priceRange.minVariantPrice
															.amount,
													) * item.quantity
												).toFixed(2),
											)}
										</span>
										<span className="line-clamp-1 text-xs text-muted-foreground">
											{formatPrice(
												Number(
													item.merchandise.product.priceRange.minVariantPrice
														.amount,
												).toFixed(2),
											)}{' '}
											each
										</span>
									</div>
								)}
							</div>
							{variant === 'default' ? <Separator /> : null}
						</div>
					)
				})}
			</div>
		</Component>
	)
}
