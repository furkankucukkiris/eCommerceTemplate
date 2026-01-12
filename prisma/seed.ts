// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Tohumlama başlatılıyor...')

  // 1. Temizlik: Önce eski verileri silelim (Bağımlılık sırasına göre)
  await prisma.image.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.store.deleteMany()

  console.log('🧹 Eski veriler temizlendi.')

  // 2. Mağaza Oluştur
  const store = await prisma.store.create({
    data: {
      name: 'Modern Concept Store',
      userId: 'admin-user-123', // Demo user ID
    }
  })

  console.log(`🏪 Mağaza oluşturuldu: ${store.name}`)

  // 3. Kategorileri Oluştur
  const catElectronics = await prisma.category.create({
    data: { name: 'Elektronik', storeId: store.id }
  })
  const catClothing = await prisma.category.create({
    data: { name: 'Giyim & Moda', storeId: store.id }
  })
  const catHome = await prisma.category.create({
    data: { name: 'Ev & Yaşam', storeId: store.id }
  })

  // 4. Ürünleri Oluştur
  
  // Ürün 1: Laptop (Elektronik)
  await prisma.product.create({
    data: {
      name: 'MacBook Pro M3',
      price: 79999.90,
      categoryId: catElectronics.id,
      storeId: store.id,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' },
          { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80' }
        ]
      }
    }
  })

  // Ürün 2: Kulaklık (Elektronik)
  await prisma.product.create({
    data: {
      name: 'Sony WH-1000XM5',
      price: 12500.00,
      categoryId: catElectronics.id,
      storeId: store.id,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80' }
        ]
      }
    }
  })

  // Ürün 3: Tişört (Giyim)
  await prisma.product.create({
    data: {
      name: 'Oversize Basic T-Shirt',
      price: 450.00,
      categoryId: catClothing.id,
      storeId: store.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' }
        ]
      }
    }
  })

  // Ürün 4: Lamba (Ev)
  await prisma.product.create({
    data: {
      name: 'Minimalist Masa Lambası',
      price: 1200.00,
      categoryId: catHome.id,
      storeId: store.id,
      isFeatured: false,
      images: {
        create: [
          { url: 'https://plus.unsplash.com/premium_photo-1682708835420-1498857971f3?q=80&w=784&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
        ]
      }
    }
  })

  console.log('✅ Tohumlama başarıyla tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })