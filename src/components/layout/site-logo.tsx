import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";

export function SiteLogo() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label={brand.name}>
      {brand.logo.imagePath ? (
        <Image src={brand.logo.imagePath} alt={brand.logo.alt} width={156} height={44} />
      ) : (
        <span className="font-serif text-lg font-semibold tracking-[0.18em] text-foreground sm:text-xl">
          DURVIN <span className="font-light">STORE</span>
        </span>
      )}
    </Link>
  );
}
