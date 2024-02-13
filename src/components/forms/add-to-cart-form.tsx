import { zodResolver } from '@hookform/resolvers/zod'
import { Form, useForm } from 'react-hook-form'

interface AddToCartFormProps {
	productId: number
	showBuyNow?: boolean
}

type Inputs = z.infer<typeof updateCartItemSchema>

export function AddToCartForm({ productId, showBuyNow }: AddToCartFormProps) {
	const form = useForm<>({
		resolver: zodResolver(schema),
	})
	return <Form {...form}></Form>
}
