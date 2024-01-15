import { revalidateTag } from 'next/cache'
import { headers as nextHeaders } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { TAGS } from '../constants'

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidate(req: NextRequest): Promise<NextResponse> {
	// We always need to respond with a 200 status code to Shopify,
	// otherwise it will continue to retry the request.
	const collectionsWebhooks = [
		'collections/create',
		'collections/update',
		'collections/delete',
	]
	const productWebhooks = [
		'products/create',
		'products/update',
		'products/delete',
	]
	const topic = nextHeaders().get('x-shopify-topic') || 'unknown'
	const secret = req.nextUrl.searchParams.get('secret')
	const isCollectionUpdate = collectionsWebhooks.includes(topic)
	const isProductUpdate = productWebhooks.includes(topic)

	if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
		// eslint-disable-next-line no-console
		console.error('Invalid revalidation secret')
		return NextResponse.json({ status: 200 })
	}

	if (!isCollectionUpdate && !isProductUpdate) {
		// We don't need to revalidate anything for any other topics.
		return NextResponse.json({ status: 200 })
	}

	// We need to revalidate all products if a collection is updated.
	if (isCollectionUpdate) {
		revalidateTag(TAGS.collections)
	}

	// We need to revalidate a specific product if a product is updated.
	if (isProductUpdate) {
		revalidateTag(TAGS.products)
	}

	return NextResponse.json({ status: 200, revalidate: true, now: Date.now() })
}
