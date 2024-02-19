import type { Metadata } from 'next'

import { Shell } from '@/components/layouts/shells/shell'
import { env } from '@/env.mjs'
import { getProduct } from '@/lib/shopify/actions/queries/get-product'
import { HIDDEN_PRODUCT_TAG } from '@/lib/shopify/constants'
import { toTitleCase } from '@/lib/utils'

import { ProductPageContainer } from './_components/product-page-container'

export const generateMetadata = async ({
	params,
}: {
	params: {
		productHandle: string
	}
}): Promise<Metadata> => {
	const product = await getProduct(params.productHandle)

	if (!product) {
		return {}
	}

	const { url, width, height, altText } = product.featuredImage ?? {}
	const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG)

	return {
		metadataBase: new URL(
			env.NEXT_PUBLIC_VERCEL_URL
				? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
				: 'http://localhost:3000',
		),
		title: toTitleCase(product.seo.title ?? product.title),
		description: product.seo.description ?? product.description,
		robots: {
			index: indexable,
			follow: indexable,
			googleBot: {
				index: indexable,
				follow: indexable,
			},
		},
		openGraph: url
			? {
					images: [
						{
							url,
							width,
							height,
							alt: altText,
						},
					],
				}
			: null,
	}
}

interface ProductPageProps {
	params: {
		productHandle: string
	}
}

function ProductPage({ params }: ProductPageProps) {
	return (
		<Shell className="pb-12 md:pb-14">
			<ProductPageContainer params={params} />
		</Shell>
	)
}

export default ProductPage
