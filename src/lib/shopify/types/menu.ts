export type Menu = {
	title: string
	href: string
}

export type ShopifyMenuOperation = {
	data: {
		menu?: {
			items: {
				title: string
				url: string
			}[]
		}
	}
	variables: {
		handle: string
	}
}
