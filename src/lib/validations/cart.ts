import { z } from 'zod'

export const cartItemSchema = z.object({
	productId: z.number(),
	quantity: z.number().int().positive(),
	subcategory: z.string().nullish(),
})

export const checkoutItemSchema = cartItemSchema.extend({
	price: z.number().nonnegative(),
})

export const cartLineItemSchema = z.object({
	id: z.string(),
})
