"use client"

import { toggleLike } from "@/lib/actions";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LikeButton({
  dashboardId, 
  likeCount,
  hasLiked 
} : {
  dashboardId: string
  likeCount: number
  hasLiked: boolean
}) {
  const [state, formAction, isPending] = useActionState(toggleLike, undefined)
  const [likes, setLikes] = useState(likeCount)
  const [hasLikedState, setHasLiked] = useState(hasLiked)
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success(`Succesfully ${hasLikedState ? "unliked" : "liked"} the dashboard`)
      setLikes(prev => hasLikedState ? prev - 1 : prev + 1)
      setHasLiked(prev => !prev)
    }
    else if (state?.message) {
      if (state.message.includes("User")) {
        toast("Unauthenticated", {
          description: "Sign in to like the dashboard",
          action: {
            label: "Sign in",
            onClick: () => {
              const callbackUrl = encodeURIComponent(window.location.href);
              router.push(`/signin?callbackUrl=${callbackUrl}`);
            },
          },
        })
      } else {
        toast.error(state.message)
      }
    }
  }, [state, hasLikedState, router])

  return (
    <form action={formAction}>
      <input type="hidden" name="dashboardId" value={dashboardId} />
      <input type="hidden" name="hasLiked" value={(!hasLikedState).toString()} />
      <Button type="submit" variant="ghost" disabled={isPending}>
        <ThumbsUp
          fill={hasLikedState ? "currentColor" : "none"}
          className="h-4 w-4"/>
        { likes }
      </Button>
    </form>
  )
}