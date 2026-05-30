"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  containerClassName?: string;
};

export default function SmartImage({ src, alt, width, height, className, containerClassName }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${containerClassName ?? ""}`}>
      {!loaded && (
        <div className="absolute inset-0 skeleton skeleton-box" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className ?? ""} ${loaded ? "img-fade" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        unoptimized
      />
    </div>
  );
}
