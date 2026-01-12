"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, ShoppingCart, List } from "lucide-react";

import { cn } from "@/lib/utils";

export function MainSidebar({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Genel Bakış',
      icon: LayoutDashboard,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Ürünler',
      icon: Package,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`, 
      label: 'Siparişler',
      icon: ShoppingCart,
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/categories`, 
      label: 'Kategoriler',
      icon: List,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Ayarlar',
      icon: Settings,
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
       {routes.map((route) => (
         <Link
           key={route.href}
           href={route.href}
           className={cn(
             "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
             route.active 
               ? "bg-secondary text-primary font-bold" // Aktifse arka planı hafif koyulaştır
               : "text-muted-foreground hover:bg-secondary/50"
           )}
         >
           <route.icon className="h-4 w-4" />
           {route.label}
         </Link>
       ))}
    </nav>
  );
}