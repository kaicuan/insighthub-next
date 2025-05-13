import { getLikeData } from "@/lib/data/dashboard"
import LikeButton from "@/components/dashboard/like-button"

export default async function LikeButtonFetcher({
  dashboardId
}: {
  dashboardId: string
}) {
    const { likeCount, hasLiked } = await getLikeData(dashboardId);
    
    return (
      <LikeButton
        dashboardId={dashboardId}
        likeCount={likeCount}
        hasLiked={hasLiked}
      />
    )
  }