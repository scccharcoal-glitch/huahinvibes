import Image, { type ImageProps } from "next/image";

type SafeImageProps = ImageProps;

function isInlineImage(src: ImageProps["src"]) {
  return typeof src === "string" && (src.startsWith("data:") || src.startsWith("blob:"));
}

export default function SafeImage({ src, alt, fill, className, ...props }: SafeImageProps) {
  if (isInlineImage(src)) {
    const inlineSrc = src as string;

    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={inlineSrc}
          alt={alt}
          className={className}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      );
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={inlineSrc} alt={alt} className={className} />;
  }

  return <Image src={src} alt={alt} fill={fill} className={className} {...props} />;
}
