import Image from "next/image"

interface ProductImageProps {
  src: string
  alt: string
  size?: "small" | "regular"
}

export function ProductImage({ src, alt, size = "regular" }: ProductImageProps) {
  const dimensions = size === "small" ? "h-12 w-12" : "h-16 w-16"
  
  return (
    <div className={`relative ${dimensions} rounded-md overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  )
}