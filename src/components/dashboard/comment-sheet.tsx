import type React from "react"
import { auth } from "@/auth"
import { getDashboardComment } from "@/lib/data/dashboard"
import { getUserById } from "@/lib/data"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, LogIn } from "lucide-react"
import CommentForm from "@/components/dashboard/comment-form"
import Link from "next/link"
import { Suspense } from "react"
import ImageWithFallback from "@/components/ui/image-with-fallback"

export default async function CommentSheet({
  id,
}: {
  id: string
}) {
  const comments = await getDashboardComment(id)
  const session = await auth()
  const userId = session?.user?.id
  let user = null

  if (userId) {
    user = await getUserById(userId)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <MessageSquare className="h-4 w-4" />
          {comments?.length}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-sm p-0 overflow-hidden flex flex-col gap-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <SheetTitle>{`Dashboard Comments (${comments?.length})`}</SheetTitle>
          </div>
          <SheetDescription>View and add comments for this dashboard</SheetDescription>
        </SheetHeader>

        {/* Comments Section - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4">
          {comments && comments.length > 0 ? (
            <div className="space-y-6 px-4">
              {comments.map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <Avatar className='flex-shrink-0'>
                      {comment.author.profile_image ? (
                        <Suspense fallback={<AvatarFallback className='rounded-lg'>{comment.author.first_name?.charAt(0)}</AvatarFallback>}>
                          <ImageWithFallback
                            src={
                              comment.author.profile_image.startsWith('http')
                                ? comment.author.profile_image
                                : `/${comment.author.profile_image}`
                            }
                            alt={`Profile image of ${comment.author.first_name}`}
                            fill={true}
                          />
                        </Suspense>
                      ) : (
                        <AvatarFallback className='rounded-lg'>{comment.author?.first_name?.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {comment.author.first_name} {comment.author.last_name}
                        </div>
                        {comment.created_at && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-xs text-muted-foreground">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Comment Form or Auth Prompt */}
        <div className="border-t p-4 bg-muted/30">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <Avatar className='flex-shrink-0'>
                  {user?.profile_image ? (
                    <Suspense fallback={<AvatarFallback className='rounded-lg'>{user?.first_name?.charAt(0)}</AvatarFallback>}>
                      <ImageWithFallback
                        src={
                          user.profile_image.startsWith('http')
                            ? user.profile_image
                            : `/${user.profile_image}`
                        }
                        alt={`Profile image of ${user?.first_name}`}
                        fill={true}
                      />
                    </Suspense>
                  ) : (
                    <AvatarFallback className='rounded-lg'>{user?.first_name?.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="font-medium text-sm">
                  {user?.first_name} {user?.last_name}
                </div>
              </div>
              <CommentForm id={id} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <p className="text-sm text-muted-foreground text-center">Sign in to join the conversation</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/signin">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
