import { cookies } from 'next/headers'

import { CartSheet } from '@/components/checkout/cart-sheet'
import { siteConfig } from '@/config/site'
import { getCart } from '@/lib/shopify/actions/queries/get-cart'

import MainNav from '../navigation/main-nav'

export async function SiteHeader() {
	const cartId = cookies().get('cartId')?.value
	let cart

	if (cartId) {
		cart = await getCart(cartId)
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background">
			<div className="container flex h-16 items-center">
				<MainNav items={siteConfig.mainNav} />
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-2">
						{/* Refactor to display no cart static component if cartId is undefined */}
						<CartSheet cart={cart} />
					</nav>
				</div>
			</div>
		</header>
	)
}
