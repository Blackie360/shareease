"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2, Check, MessageCircle, Mail, Phone, Instagram, Link } from "lucide-react"
import { shareBill } from "@/lib/actions"
import type { SharePlatform } from "@/types"

interface ShareBillDialogProps {
  billId: string
  billTitle: string
}

export function ShareBillDialog({ billId, billTitle }: ShareBillDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleShare = async (platform: SharePlatform) => {
    try {
      const result = await shareBill(billId, platform)

      if (result.error) {
        console.error(result.error)
        return
      }

      if (platform === "copy") {
        await navigator.clipboard.writeText(result.shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else if (platform === "instagram") {
        // For Instagram, we can only copy the link as direct sharing isn't supported via URL
        await navigator.clipboard.writeText(result.shareUrl)
        alert("Link copied! Open Instagram and paste in your message.")
      } else {
        // Open the share URL in a new window
        window.open(result.shareUrl, "_blank")
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error sharing bill:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-brand-500 text-white hover:bg-brand-600">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Bill</DialogTitle>
          <DialogDescription>Share "{billTitle}" with participants or on social media</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleShare("whatsapp")}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5 fill-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleShare("twitter")}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5 fill-black">
                <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
              </svg>
              X (Twitter)
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleShare("instagram")}
            >
              <Instagram className="h-5 w-5 text-pink-600" />
              Instagram
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleShare("telegram")}
            >
              <MessageCircle className="h-5 w-5 text-blue-500" />
              Telegram
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleShare("email")}
            >
              <Mail className="h-5 w-5 text-gray-500" />
              Email
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleShare("sms")}
            >
              <Phone className="h-5 w-5 text-green-600" />
              SMS
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 col-span-2"
              onClick={() => handleShare("copy")}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Link className="h-5 w-5" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
