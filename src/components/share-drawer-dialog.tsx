"use client"

import { useState, useActionState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { toast } from "sonner"
import { Copy, Download, Globe, LockKeyhole } from "lucide-react"
import { QRCodeCanvas } from 'qrcode.react';
import { updateDashboardPublic } from "@/lib/actions"

export function ShareDrawerDialog({
  dashboardId,
  dashboardTitle,
  dashboardIsPublic,
  isAuthor,
  children,
}: {
  dashboardId: string
  dashboardTitle: string
  dashboardIsPublic: boolean
  isAuthor: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const Content = ({ className }: { className?: string }) => (
    <div className={cn("space-y-6", className)}>
      <ShareForm
        dashboardId={dashboardId}
        dashboardIsPublic={dashboardIsPublic}
        dashboardTitle={dashboardTitle}
        isAuthor={isAuthor}
      />
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="break-words">
              Share '{dashboardTitle}'
            </DialogTitle>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="break-words">
              Share '{dashboardTitle}'
            </DrawerTitle>
          </DrawerHeader>
          <Content className="px-4 mb-8" />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ShareForm({
  dashboardId,
  dashboardIsPublic,
  dashboardTitle,
  isAuthor,
}: {
  dashboardId: string
  dashboardIsPublic: boolean
  dashboardTitle: string
  isAuthor: boolean
}) {
  const [state, formAction, isPending] = useActionState(updateDashboardPublic, null)
  const qrRef = useRef<HTMLCanvasElement>(null);
  const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/dashboard/${dashboardId}/view`

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message)
    }
  }, [state])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy link')
      console.error('Failed to copy URL:', err)
    }
  }

  const handleDownloadQR = () => {
    if (qrRef.current == null) {
      toast.error('QR code not available')
      return
    }
    
    try {
      const a = document.createElement('a');
      a.download = `${dashboardTitle}-qrcode.png`;
      a.href = qrRef.current.toDataURL('image/png');
      a.click()
    } catch (error) {
      toast.error('Failed to download QR code')
      console.error('Download failed:', error)
    }
  }

  return (
    <>
      {isAuthor &&
        <form
          action={formAction}
          className="space-y-6"
        >
          <input type="hidden" name="id" value={dashboardId} />
          <input
            type="hidden"
            name="isPublic"
            value={(!dashboardIsPublic).toString()}
          />

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 pr-6">
            {dashboardIsPublic ? (
              <>
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <Label className="font-medium">Public Access</Label>
                  <p className="text-xs text-muted-foreground pt-1">
                    Public dashboard. Anyone can view this dashboard.
                  </p>
                </div>
              </>
            ) : (
              <>
                <LockKeyhole className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <Label className="font-medium">Restricted Access</Label>
                  <p className="text-xs text-muted-foreground pt-1">
                      Private dashboard. Only you have access to this dashboard.
                    </p>
                </div>
              </>
            )}
            </div>
            <Switch
              checked={dashboardIsPublic}
              disabled={isPending}
              type="submit"
              aria-label="Toggle public access"
            />
          </div>
        </form>
      }

      {dashboardIsPublic && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="overflow-hidden bg-white rounded-lg">
              <QRCodeCanvas
                id="qrcode"
                ref={qrRef}
                value={shareUrl}
                size={128}
                marginSize={2}
              />
            </div>
            <Button
              variant="secondary"
              onClick={handleDownloadQR}
            >
              <Download className="w-4 h-4" />
              Download QR
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Shareable Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="bg-muted/50 border-none"
              />
              <Button
                size="icon"
                variant="secondary"
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}