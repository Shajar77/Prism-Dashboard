import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-md bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl p-0 overflow-hidden ${className || ""}`}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/5">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="px-6 py-5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
