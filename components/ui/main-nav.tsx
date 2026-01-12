"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"; // 1. Hook'ları çağırdık

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams(); // 2. URL'deki storeId'yi yakaladık

  // 3. Rotaları dinamik oluşturuyoruz
  // Her linkin başına `params.storeId` ekliyoruz.
  const routes = [
    {
      href: `/${params.storeId}`, // Dashboard (Genel Bakış)
      label: 'Genel Bakış',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/products`, // Ürünler Sayfası
      label: 'Ürünler',
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/settings`, // Ayarlar (İleride lazım olacak)
      label: 'Ayarlar',
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {/* 4. Listeyi ekrana basıyoruz */}
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}