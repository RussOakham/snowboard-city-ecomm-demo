import { ErrorCard } from '@/components/cards/error-card'
import { Shell } from '@/components/layouts/shells/shell'

export default function ProductModalNotFound() {
	return (
		<Shell variant="centered" className="max-w-md">
			<ErrorCard
				title="Product not found"
				description="The product may have expired or you may have already updated your product"
				retryLink="/"
				retryLinkText="Go back to home page"
			/>
		</Shell>
	)
}
