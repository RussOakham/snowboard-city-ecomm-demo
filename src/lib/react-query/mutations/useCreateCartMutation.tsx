import { createCart } from '@/lib/shopify/actions/mutations/create-cart'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

export const useCreateCartMutation = () => {
	const mutation = useMutation({
		mutationFn: async () => createCart(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] })
		},
	})

	// Check what needs to be returned here

	return [mutation.mutate] as const
}
