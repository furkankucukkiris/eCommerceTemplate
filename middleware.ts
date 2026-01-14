import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public (Herkese Açık) Rotalar
// Buraya eklenen sayfalara giriş yapmadan erişilebilir.
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', // Giriş sayfası ve alt yolları (ÖNEMLİ!)
  '/sign-up(.*)', // Kayıt sayfası
  '/api/uploadthing(.*)', // Resim yükleme webhookları (Gerekliyse)
  '/api(.*)', // Diğer API rotaları
  '/' // Anasayfa (Shop kısmı)
]);

export default clerkMiddleware(async (auth, req) => {
  // Eğer istek public değilse, kullanıcıyı korumaya al (Giriş sayfasına at)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Next.js statik dosyaları hariç her şeyi yakala
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API rotalarını her zaman yakala
    '/(api|trpc)(.*)',
  ],
};