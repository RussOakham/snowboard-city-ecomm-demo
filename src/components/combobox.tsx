'use client'

import { useState } from 'react'
import { CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { type Option } from '@/types'

import { Button } from './ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface ComboBoxProps {
	selected: Option | null
	setSelected: React.Dispatch<React.SetStateAction<Option | null>>
	options: Option[]
	label?: string
	labelPlural?: string
}

export function Combobox({
	selected,
	setSelected,
	options,
	label = 'option',
	labelPlural = 'options',
}: ComboBoxProps) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selected
						? options.find((option) => option.value === selected.value)?.label
						: `Select ${label}...`}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder={`Search ${labelPlural}...`}
						className="h-9"
					/>
					<CommandEmpty>{`No ${labelPlural} found`}</CommandEmpty>
					<CommandGroup>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								value={option.value}
								onSelect={(currentValue) => {
									setSelected(
										currentValue === selected?.value ? null : { ...option },
									)
									setOpen(false)
								}}
							>
								<CheckIcon
									className={cn(
										'mr-2 h-4 w-4',
										selected?.value === option.value
											? 'opacity-100'
											: 'opacity-0',
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
