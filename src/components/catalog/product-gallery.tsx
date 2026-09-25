"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { brand } from "@/config/brand";
import type { ProductImage } from "@/types/catalog";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="grid gap-3 sm:grid-cols-[5rem_minmax(0,1fr)]">
      <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image.src}-${image.position}`}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-square w-16 overflow-hidden rounded-xl border bg-[#f6f0ec] transition sm:w-auto ${selectedIndex === index ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary"}`}
            aria-label={`نمایش تصویر ${new Intl.NumberFormat("fa-IR").format(index + 1)} محصول ${productName}`}
            aria-pressed={selectedIndex === index}
          >
            <img src={image.src} alt="" onError={(event) => { event.currentTarget.src = brand.assets.heroImage; }} className="size-full object-cover" style={{ objectPosition: image.position }} />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-square overflow-hidden rounded-2xl bg-[#f6f0ec] sm:order-2">
        <img src={selectedImage.src} alt={productName} onError={(event) => { event.currentTarget.src = brand.assets.heroImage; }} className="size-full object-cover" style={{ objectPosition: selectedImage.position }} />
      </div>
    </div>
  );
}
