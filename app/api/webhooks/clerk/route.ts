// - app/api/webhooks/clerk/route.ts

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prismadb from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 1. Clerk Dashboard'dan alacağın Webhook Secret anahtarı
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // 2. Header bilgilerini al (İmza doğrulaması için)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Eğer headerlar eksikse hata dön
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occured -- no svix headers', {
      status: 400
    })
  }

  // 3. Body verisini al
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 4. İmzayı doğrula (Svix ile)
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400
    })
  }

  // 5. Olay türüne göre işlem yap
  const eventType = evt.type;

  // KULLANICI OLUŞTURULDUĞUNDA (user.created)
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    // Email adresini güvenli şekilde al
    const email = email_addresses && email_addresses[0]?.email_address; 

    if (!email) {
      return new NextResponse('No email found', { status: 400 });
    }

    await prismadb.user.create({
      data: {
        id: id, // Clerk ID'sini User ID olarak kullanıyoruz
        email: email,
        firstName: first_name || "",
        lastName: last_name || "",
        imageUrl: image_url || "",
      }
    });
  }

  // KULLANICI GÜNCELLENDİĞİNDE (user.updated)
  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses && email_addresses[0]?.email_address;

    await prismadb.user.update({
      where: { id: id },
      data: {
        email: email,
        firstName: first_name || "",
        lastName: last_name || "",
        imageUrl: image_url || "",
      }
    });
  }
  
  // KULLANICI SİLİNDİĞİNDE (user.deleted) - İsteğe bağlı
  if (eventType === 'user.deleted') {
     const { id } = evt.data;
     if(id) {
        await prismadb.user.delete({
            where: { id: id }
        });
     }
  }

  return new NextResponse('Webhook received', { status: 200 });
}