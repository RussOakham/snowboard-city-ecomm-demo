import { cookies } from 'next/headers'

import { CartSheet } from '@/components/checkout/cart-sheet'
import { CartSheetEmpty } from '@/components/checkout/empty-cart-sheet'
import { siteConfig } from '@/config/site'
import { getCart } from '@/lib/shopify/actions/queries/get-cart'

import { ErrorBoundary } from '../error-boundary'
import MainNav from '../navigation/main-nav'

import { SearchNav } from './search-nav'

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
						<SearchNav />
						<ErrorBoundary>
							{cart ? <CartSheet cart={cart} /> : <CartSheetEmpty />}
						</ErrorBoundary>
					</nav>
				</div>
			</div>
		</header>
	)
}
