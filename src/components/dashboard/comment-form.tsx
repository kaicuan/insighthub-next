"use client"

import { createComment } from "@/lib/actions"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Send, SendHorizonal } from "lucide-react"

export default function CommentForm({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(createComment, undefined)
  const [comment, setComment] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message)
    } else if (state?.success) {
      // toast.success("Comment posted successfully")
      setComment("")
      setIsExpanded(false)
    }
  }, [state])

  const handleFocus = () => {
    setIsExpanded(true)
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="dashboardId" value={id} />
      <Textarea
        id="content"
        name="content"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        required
        className={`transition-all duration-200 ${isExpanded ? "min-h-[100px]" : "min-h-[60px]"} focus:border-primary`}
        onFocus={handleFocus}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !comment.trim()}>
          {isPending ? "Posting..." : "Post Comment"}
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
