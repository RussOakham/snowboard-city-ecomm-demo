import { cookies } from 'next/headers'

import { CartSheet } from '@/components/checkout/cart-sheet'
import { siteConfig } from '@/config/site'

import MainNav from '../navigation/main-nav'

const SiteHeader = () => {
	let cartId = cookies().get('cartId')?.value

	if (!cartId) {
		cartId = ''
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background">
			<div className="container flex h-16 items-center">
				<MainNav items={siteConfig.mainNav} />
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-2">
						<CartSheet cartId={cartId} />
					</nav>
				</div>
			</div>
		</header>
	)
}

export default SiteHeader
