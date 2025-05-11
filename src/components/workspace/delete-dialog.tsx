// components/DeleteDialog.tsx
"use client"

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { deleteDashboard } from "@/lib/actions";
import { toast } from "sonner";

export default function DeleteDialog({
  dashboardId,
  dashboardTitle,
  children,
}: {
  dashboardId: string,
  dashboardTitle: string,
  children: React.ReactNode,
}) {
  const [state, formAction, isPending] = useActionState(deleteDashboard, null)

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
  <Dialog>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent className="!max-w-sm">
      <DialogHeader>
        <DialogTitle>Delete confirmation</DialogTitle>
        <DialogDescription className="break-words">
          Are you sure you want to delete <b>'{dashboardTitle}'</b>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex-row justify-end">
        <DialogClose asChild>
          <Button variant="ghost">
            Cancel
          </Button>
        </DialogClose>
        <form action={formAction}>
          <input type="hidden" name="id" value={dashboardId} />
          <Button
            type="submit"
            variant="destructive"
            disabled={isPending}
            aria-disabled={isPending}
          >
            {isPending ? (
              <span className="animate-pulse">Deleting...</span>
            ) : (
              <>
                Delete
              </>
            )}
          </Button>
        </form>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}