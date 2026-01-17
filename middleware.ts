// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public (Herkese Açık) Rotalar
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing(.*)', // Resim yükleme servisi genelde public callback ister
  '/api/webhook(.*)', // Stripe/Clerk webhookları için
  '/', 
  '/product(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};