import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'

interface RatingProps {
	rating: number
}

export function Rating({ rating }: RatingProps) {
	return (
		<div className="flex items-center space-x-1">
			{Array.from({ length: 5 }).map((_, i) => {
				const index = i + 1

				if (rating >= index) {
					return (
						<StarFilledIcon
							key={index}
							className="size-4 text-yellow-500"
							aria-hidden="true"
						/>
					)
				}

				return (
					<StarIcon
						key={index}
						className="size-4 text-yellow-500"
						aria-hidden="true"
					/>
				)
			})}
		</div>
	)
}
