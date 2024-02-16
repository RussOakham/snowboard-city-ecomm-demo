import { redirect } from 'next/navigation'

interface ProductPreviewPageProps {
	params: {
		productHandle: string
	}
}

export default function ProductPreviewPage({
	params,
}: ProductPreviewPageProps) {
	redirect(`/product/${params.productHandle}`)
}
