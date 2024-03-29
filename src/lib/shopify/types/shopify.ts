export type Maybe<T> = T | null

export type Connection<T> = {
	edges: Array<Edge<T>>
}

export type Edge<T> = {
	node: T
}

export type Image = {
	url: string
	altText: string
	width: number
	height: number
}

export type Money = {
	amount: string
	currencyCode: string
}

export type SEO = {
	title: string
	description: string
}
