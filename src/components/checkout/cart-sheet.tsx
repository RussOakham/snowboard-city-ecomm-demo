import { type Route } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

// import { useGetCartQuery } from '@/lib/react-query/queries/useGetCartQuery'
import { getCart } from '@/lib/shopify/actions/queries/get-cart'
import { cn, formatPrice } from '@/lib/utils'

import { Icons } from '../icons'
import { Badge } from '../ui/badge'
import { Button, buttonVariants } from '../ui/button'
import { Separator } from '../ui/separator'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet'

import { CartLineItems } from './cart-line-items'

export async function CartSheet() {
	const cartId = cookies().get('cartId')?.value
	let cart

	// conflict due to use of next/headers
	// const [data] = useGetCartQuery(cartId as string)

	// if (data !== undefined) {
	// 	cart = data
	// }

	if (cartId) {
		cart = await getCart(cartId)
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					aria-label="Open cart"
					variant="outline"
					size="icon"
					className="relative"
				>
					{cart && cart.totalQuantity > 0 && (
						<Badge
							variant="secondary"
							className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
						>
							{cart.totalQuantity}
						</Badge>
					)}
					<Icons.Cart className="size-4" aria-hidden="true" />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
				<SheetHeader className="space-y-2.5 pr-6">
					<SheetTitle>
						Cart {cart && cart?.totalQuantity > 0 && `(${cart?.totalQuantity})`}{' '}
					</SheetTitle>
					<Separator />
				</SheetHeader>
				{cart && cart?.totalQuantity > 0 ? (
					<div className="space-y-4 pr-6">
						<CartLineItems items={cart.lines} />
						<Separator />
						<div className="space-y-1.5 text-sm">
							<div className="flex">
								<span className="flex-1">Taxes</span>
								<span>Calculated at checkout</span>
							</div>
							<div className="flex">
								<span className="flex-1">Total</span>
								<span>
									{formatPrice(Number(cart.cost.totalAmount.amount).toFixed(2))}
								</span>
							</div>
							<SheetFooter>
								<SheetTrigger asChild>
									<Link
										aria-label="View your cart"
										href={cart.checkoutUrl as Route}
										className={buttonVariants({
											size: 'sm',
											className: 'w-full',
										})}
									>
										Continue to checkout
									</Link>
								</SheetTrigger>
							</SheetFooter>
						</div>
					</div>
				) : (
					<div className="flex h-full flex-col items-center justify-center space-y-1">
						<Icons.Cart
							className="mb-4 size-16 text-muted-foreground"
							aria-hidden="true"
						/>
						<div className="text-xl font-medium text-muted-foreground">
							Your cart is empty
						</div>
						<SheetTrigger asChild>
							<Link
								aria-label="Add items to your cart to checkout"
								href="/products"
								className={cn(
									buttonVariants({
										variant: 'link',
										size: 'sm',
										className: 'text-sm text-muted-foreground',
									}),
								)}
							>
								Add items to your cart to checkout
							</Link>
						</SheetTrigger>
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}
