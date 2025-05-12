// @/components/workspace/create-dashboard-drawer-dialog.tsx
'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { createDashboard } from "@/lib/actions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export default function DrawerDialog() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" strokeWidth={3} />
            New Dashboard
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create new dashboard</DialogTitle>
            <DialogDescription>
              Fill out all required details to create your dashboard
            </DialogDescription>
          </DialogHeader>
          <CreateDashboardForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" strokeWidth={3} />
          New Dashboard
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-10">
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader className="text-left">
          <DrawerTitle>Create new dashboard</DrawerTitle>
          <DrawerDescription>
            Fill out all required details to create your dashboard
          </DrawerDescription>
        </DrawerHeader>
        <CreateDashboardForm className="px-4" />
      </div>
      </DrawerContent>
    </Drawer>
  )
}

function CreateDashboardForm({ className }: React.ComponentProps<"form">) {
  const [state, action, isPending] = useActionState(createDashboard, undefined)
  const [title, setTitle] = React.useState('')

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      action={action}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Dashboard Title</Label>
        <Input 
          type="text" 
          id="title" 
          name="title" 
          placeholder="Dashboard title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {state?.errors?.title && (
          <p className="text-red-500 text-sm">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="grid gap-2 min-w-full">
        <Label htmlFor="file">CSV Data File</Label>
        <Input
            type="file"
            id="file"
            name="file"
            accept=".csv"
            required
          />
        {state?.errors?.file && (
          <p className="text-red-500 text-sm">{state.errors.file[0]}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? (
          <span className="animate-pulse">Creating Dashboard...</span>
        ) : (
          'Create Dashboard'
        )}
      </Button>

      {state?.message && (
        <p className="text-red-500 text-sm text-center">{state.message}</p>
      )}
    </form>
  )
}