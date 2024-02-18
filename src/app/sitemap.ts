import { MetadataRoute } from 'next'

import { getCollections } from '@/lib/shopify/actions/queries/get-collections'
import { getProducts } from '@/lib/shopify/actions/queries/get-products'
import { absoluteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Manual Routes
	const routes: MetadataRoute.Sitemap = ['', '/products'].map((route) => ({
		url: absoluteUrl(route),
		lastModified: new Date().toISOString(),
	}))

	// Product Routes
	const products = await getProducts({})

	const productRoutes = products.map((product) => ({
		url: absoluteUrl(`/products/${product.handle}`),
		lastModified: product.updatedAt,
	}))

	// Categories Routes
	const categoriesRoutes = products.map((product) => ({
		url: absoluteUrl(`/categories/${product.productType.toLowerCase()}`),
		lostModified: new Date().toISOString(),
	}))

	// Collections Routes
	const collections = await getCollections()

	const collectionRoutes = collections.map((collection) => ({
		url: absoluteUrl(collection.path),
		lasModified: collection.updatedAt,
	}))

	const routeArray = [
		...routes,
		...productRoutes,
		...categoriesRoutes,
		...collectionRoutes,
	]

	// remove duplicates url objects from routeArray
	const uniqueRoutes: MetadataRoute.Sitemap = routeArray.filter(
		(route, index, self) =>
			index === self.findIndex((t) => t.url === route.url),
	)

	return uniqueRoutes
}
