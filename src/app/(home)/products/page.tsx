import { Metadata } from 'next'

import { Shell } from '@/components/layouts/shells/shell'
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import { env } from '@/env.mjs'

import { ProductsPageContainer } from './_components/products-page-container'

export const metadata: Metadata = {
	metadataBase: new URL(
		env.NEXT_PUBLIC_VERCEL_URL
			? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
			: 'http://localhost:3000',
	),
	title: 'Products',
	description: 'Buy the best products from our store',
}
export default function ProductsPage() {
	return (
		<Shell>
			<PageHeader>
				<PageHeaderHeading size="sm">Products</PageHeaderHeading>
				<PageHeaderDescription size="sm">
					Buy the best products from our store
				</PageHeaderDescription>
			</PageHeader>
			<ProductsPageContainer />
		</Shell>
	)
}

ProductsPage.displayName = 'ProductsPage'
