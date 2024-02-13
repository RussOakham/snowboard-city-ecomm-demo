import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
	const { currency = 'GBP', notation = 'compact' } = options

	return new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency,
		notation,
	}).format(Number(price))
}

export function truncate(str: string, length: number) {
	return str.length > length ? `${str.slice(0, length)}...` : str
}
