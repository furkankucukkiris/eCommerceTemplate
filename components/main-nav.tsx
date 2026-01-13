"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Genel Bakış', // Dashboard
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Ürünler',
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/categories`, // Kategoriler sayfanız varsa
      label: 'Kategoriler',
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/orders`, // Siparişler sayfanız varsa
      label: 'Siparişler',
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`, // Ayarlar sayfanız varsa
      label: 'Ayarlar',
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}