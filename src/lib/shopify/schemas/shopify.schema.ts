// Generated by ts-to-zod
import { z } from 'zod'

export const imageSchema = z.object({
	url: z.string(),
	altText: z.string(),
	width: z.number(),
	height: z.number(),
})

export const moneySchema = z.object({
	amount: z.string(),
	currencyCode: z.string(),
})

export const seoSchema = z.object({
	title: z.string(),
	description: z.string(),
})
