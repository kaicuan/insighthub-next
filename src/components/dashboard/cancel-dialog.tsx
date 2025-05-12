// @/components/dashboard/cancel-dialog.tsx
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
import Link from "next/link";

export default function CancelDialog({
  dashboardId,
  children,
}: {
  dashboardId: string,
  children: React.ReactNode,
}) {
  return (
  <Dialog>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent className="!max-w-sm">
      <DialogHeader>
        <DialogTitle>Cancel confirmation</DialogTitle>
        <DialogDescription className="break-words">
          Are you sure you want to cancel all changes? You will lose all changes made to the dashboard. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex-row justify-end">
        <DialogClose asChild>
          <Button variant="ghost">
            {"No, take me back"}
          </Button>
        </DialogClose>
        <Link href={`/dashboard/${dashboardId}/view`}>
          <Button type="submit" variant="destructive">
            {"Yes, I'm sure"}
          </Button>
        </Link>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}