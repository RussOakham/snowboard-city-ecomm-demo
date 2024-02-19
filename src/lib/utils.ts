import { type ClassValue, clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { env } from '@/env.mjs'

export function absoluteUrl(path?: string) {
	if (!path) {
		return env.NEXT_PUBLIC_VERCEL_URL
			? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
			: 'http://localhost:3000'
	}

	return env.NEXT_PUBLIC_VERCEL_URL
		? `https://${env.NEXT_PUBLIC_VERCEL_URL}${path}`
		: `http://localhost:3000${path}`
}

export function catchError(err: unknown) {
	if (err instanceof z.ZodError) {
		const errors = err.issues.map((issue) => {
			return issue.message
		})
		return toast.error(errors.join('/n'))
	}

	if (err instanceof Error) {
		return toast.error(err.message)
	}

	return toast.error('Something went wrong, please try again later.')
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatPrice(
	price: number | string,
	options: {
		currency?: 'USD' | 'EUR' | 'GBP'
		notation?: Intl.NumberFormatOptions['notation']
	} = {},
) {
	const { currency = 'GBP', notation = 'standard' } = options

	return new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency,
		notation,
	}).format(Number(price))
}

export function isMacOs() {
	if (typeof window === 'undefined') return false

	return window.navigator.userAgent.includes('Mac')
}

export function toTitleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
	)
}

export function truncate(str: string, length: number) {
	return str.length > length ? `${str.slice(0, length)}...` : str
}
