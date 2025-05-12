// @/components/ui/image-with-fallback.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect, useMemo } from 'react'

// Extend the built-in ImageProps to include an optional fallback source
interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: ImageProps['src']
  fallback?: ImageProps['src']
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

/**
 * A Next.js Image component with optional fallback support.
 * 
 * @param {string | StaticImport} src - The primary image source.
 * @param {string | StaticImport} [fallback] - Optional fallback image source.
 * @param {string} alt - Required alt text for accessibility.
 * @param {ImageProps} props - Additional props passed to the underlying next/image.
 */
const ImageWithFallback = ({
  src,
  fallback=`${basePath}/image-fallback.png`,
  alt,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false)

  // Normalize the original src once
  const resolvedSrc = useMemo(() => {
    const srcStr = src?.toString?.() ?? ''
    return srcStr.startsWith('http') ? src : `${basePath}${srcStr}`
  }, [src])

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false)
  }, [resolvedSrc])

  return (
    <Image
      alt={alt}
      src={hasError && fallback ? fallback : resolvedSrc}
      onError={() => setHasError(true)}
      {...props}
    />
  )
}

export default ImageWithFallback