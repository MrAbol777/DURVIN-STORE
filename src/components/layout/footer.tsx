import Link from "next/link";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/config/brand";
import { SiteLogo } from "@/components/layout/site-logo";

const footerLinks = [
  { label: "خانه", href: "/" },
  { label: "محصولات", href: "/products" },
  { label: "دسته‌بندی‌ها", href: "/#categories" },
  { label: "درباره ما", href: "/about" },
];

const supportLinks = [
  { label: "پیگیری سفارش", href: "/track-order" },
  { label: "تماس با ما", href: "/contact" },
  { label: "قوانین و مقررات", href: "/terms" },
  { label: "حریم خصوصی", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#f8f3ef]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr] lg:px-8 lg:py-16">
        <div>
          <SiteLogo />
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted">{brand.description}</p>
          <a
            href={brand.contact.instagram ? `https://instagram.com/${brand.contact.instagram}` : "#"}
            className="mt-5 inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary"
            aria-label="اینستاگرام Durvin Store"
          >
            <Camera className="size-4" aria-hidden="true" />
          </a>
        </div>
        <FooterColumn title="دسترسی سریع" links={footerLinks} />
        <FooterColumn title="راهنما" links={supportLinks} />
        <div>
          <h2 className="text-sm font-semibold text-foreground">ارتباط با ما</h2>
          <ul className="mt-5 grid gap-4 text-sm text-muted">
            <li className="flex items-center gap-2"><Phone className="size-4 text-primary" aria-hidden="true" />{brand.contact.phone}</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-primary" aria-hidden="true" />{brand.contact.email}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />{brand.contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted sm:px-6 lg:px-8">
        © {new Intl.NumberFormat("fa-IR").format(new Date().getFullYear())} {brand.name}. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted transition hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
