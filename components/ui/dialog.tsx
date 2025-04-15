"use client"

import * as React from "react"
import * as DialogP from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogP.Root

const DialogTrigger = DialogP.Trigger

const DialogPortal = ({ className, ...props }: DialogP.DialogPortalProps) => (
  <DialogP.Portal className={cn(className)} {...props} />
)
DialogPortal.displayName = DialogP.Portal.displayName

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogP.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogP.Overlay>
>(({ className, ...props }, ref) => (
  <DialogP.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogP.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogP.Content>,
  React.ComponentPropsWithoutRef<typeof DialogP.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogP.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
        className,
      )}
      {...props}
    >
      {children}
      <DialogP.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogP.Close>
    </DialogP.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogP.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogP.Title>,
  React.ComponentPropsWithoutRef<typeof DialogP.Title>
>(({ className, ...props }, ref) => (
  <DialogP.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
DialogTitle.displayName = DialogP.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogP.Description>,
  React.ComponentPropsWithoutRef<typeof DialogP.Description>
>(({ className, ...props }, ref) => (
  <DialogP.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogP.Description.displayName

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
