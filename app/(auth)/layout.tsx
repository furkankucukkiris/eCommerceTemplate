// app/(auth)/layout.tsx
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full">
      {/* SOL Taraf: Giriş Formu */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        {children}
      </div>

      {/* SAĞ Taraf: Görsel (Sadece büyük ekranlarda) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <Image 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" // Örnek moda görseli
          alt="Login Background"
          fill
          className="object-cover"
        />
        {/* Görselin üzerine yazı yazmak istersen */}
        <div className="absolute bottom-10 left-10 text-white z-10">
          <h2 className="text-4xl font-bold">Yeni Sezonu Keşfet</h2>
          <p className="text-lg opacity-90">Sadece üyelere özel fırsatlar.</p>
        </div>
        {/* Karartma katmanı */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}