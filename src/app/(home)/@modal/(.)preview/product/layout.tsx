import React from 'react'

import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'

interface ModalLayoutProps {
	children: React.ReactNode
}

export default function ModalLayout({ children }: ModalLayoutProps) {
	return (
		<AlertDialog defaultOpen>
			<AlertDialogContent className="max-w-3xl overflow-hidden">
				{children}
			</AlertDialogContent>
		</AlertDialog>
	)
}
