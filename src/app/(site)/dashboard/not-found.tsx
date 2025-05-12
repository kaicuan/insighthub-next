// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ChevronLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-10 lg:px-24 min-h-[calc(100vh-140px)] flex items-center">
      <div className="w-full text-center py-16">
        <div className="mb-8 inline-flex bg-destructive/10 p-6 rounded-full">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
          Dashboard Not Found
        </h1>
        
        <p className="mt-6 text-md leading-7 text-muted-foreground max-w-2xl mx-auto">
          The dashboard you're looking for either doesn't exist, has been removed, 
          or you don't have permission to view it. Please check the URL or contact 
          the dashboard owner if you believe this is an error.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Button asChild variant="default" size="lg">
            <Link href="/workspace">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Workspace
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}