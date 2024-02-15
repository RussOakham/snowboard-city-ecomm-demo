import { Shell } from '@/components/layouts/shells/shell'
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import { Products } from '@/components/products'
import { SearchParams } from '@/types'

interface ProductsPageProps {
	searchParams: SearchParams
}

const categories = [
	'snowboards',
	'ski-jackets',
	'goggles',
	'snowboard-boots',
	'accessories',
]

export default function ProductsPage({ searchParams }: ProductsPageProps) {
	console.log(searchParams)

	return (
		<Shell>
			<PageHeader>
				<PageHeaderHeading size="sm">Products</PageHeaderHeading>
				<PageHeaderDescription size="sm">
					Buy the best products from our store
				</PageHeaderDescription>
			</PageHeader>
			<Products categories={categories} />
		</Shell>
	)
}
