// Generated by ts-to-zod
import { z } from 'zod'

import { seoSchema } from './shopify.schema'

export const shopifyCollectionSchema = z.object({
	handle: z.string(),
	title: z.string(),
	description: z.string(),
	seo: seoSchema,
	updatedAt: z.string(),
})

export const shopifyCollectionOperationSchema = z.object({
	data: z.object({
		collection: z.object({
			handle: z.string(),
			title: z.string(),
			description: z.string(),
			seo: seoSchema,
			updatedAt: z.string(),
		}),
	}),
	variables: z.object({
		handle: z.string(),
	}),
})

export const shopifyCollectionsOperationSchema = z.object({
	data: z.object({
		collections: z.any(),
	}),
})

export const collectionSchema = shopifyCollectionSchema.and(
	z.object({
		path: z.string(),
	}),
)
