import { Shell } from '@/components/layouts/shells/shell'
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import { SearchParams } from '@/types'

interface ProductsPageProps {
	searchParams: SearchParams
}

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
		</Shell>
	)
}
