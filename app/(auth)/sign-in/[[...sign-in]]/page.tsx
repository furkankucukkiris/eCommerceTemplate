// app/(auth)/sign-in/[[...sign-in]]/page.tsx

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn 
      appearance={{
        elements: {
          formButtonPrimary: 
            "bg-black hover:bg-gray-800 text-white text-sm normal-case", // Buton stili
          card: 
            "shadow-none border border-gray-200 rounded-none", // Kartın dış çerçevesi
          headerTitle: 
            "text-2xl font-bold text-black", // Başlık stili
          headerSubtitle: 
            "text-gray-500", // Alt başlık
          socialButtonsBlockButton: 
            "border-gray-200 hover:bg-gray-50 text-gray-600 text-sm normal-case", // Google/Github butonları
          footerActionLink: 
            "text-black hover:underline" // "Kayıt ol" linki
        }
      }}
    />
  );
}