// Generated by ts-to-zod
import { z } from 'zod'

import { seoSchema } from './shopify.schema'

export const shopifyPagesOperationSchema = z.object({
	data: z.object({
		pages: z.any(),
	}),
})

export const pageSchema = z.object({
	id: z.string(),
	title: z.string(),
	handle: z.string(),
	body: z.string(),
	bodySummary: z.string(),
	seo: seoSchema.optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export const shopifyPageOperationSchema = z.object({
	data: z.object({
		pageByHandle: pageSchema,
	}),
	variables: z.object({
		handle: z.string(),
	}),
})
