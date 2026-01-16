# Modern E-Commerce Platform & CMS

This project is a full-stack e-commerce solution designed to provide a seamless experience for both store owners (Admin) and customers (Storefront). It leverages the latest web technologies to ensure performance, scalability, and ease of use.

Bu proje, hem mağaza sahipleri (Admin) hem de müşteriler (Vitrin) için sorunsuz bir deneyim sağlamak üzere tasarlanmış tam kapsamlı bir e-ticaret çözümüdür. Performans, ölçeklenebilirlik ve kullanım kolaylığı sağlamak için en son web teknolojilerinden yararlanır.

---

## 🇬🇧 EN - Project Overview & Purpose

### 🎯 Goal
Our primary goal is to build a **production-ready e-commerce template** that goes beyond simple product listing. We aim to create a dynamic ecosystem where users can:
1.  **Manage Everything:** Control products, categories, variations (colors, sizes), and store settings from a centralized Admin Dashboard.
2.  **Scale Easily:** Support multiple stores under a single account (Multi-tenant architecture).
3.  **Offer Modern UX:** Provide customers with a high-end shopping experience featuring modern design patterns like Bento Grids, dynamic navigation, and seamless checkout flows.

### ✨ Key Features
* **Multi-Store Support:** Manage multiple separate e-commerce stores from a single dashboard.
* **Dynamic CMS:** Real-time management of Billboards, Categories, Products, and Attributes (Colors/Sizes).
* **Modern UI/UX:**
    * **Bento Grid Design:** Apple-style feature showcasing.
    * **Dynamic Navbar:** Customizable logos and social media links directly from the admin panel.
    * **Floating Contact:** Minimalist "Quick Action" button for WhatsApp and Phone support.
* **Robust Backend:** Built with Next.js 15+ Server Actions for speed and SEO optimization.
* **Secure Authentication:** Integrated with Clerk for robust user management.
* **Database:** PostgreSQL with Prisma ORM for type-safe database interactions.

### 🛠 Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & Shadcn UI
* **Database:** PostgreSQL & Prisma ORM
* **Auth:** Clerk
* **Uploads:** Cloudinary (for image management)

### 🚀 Getting Started

1.  **Clone and Install:**
    ```bash
    npm install
    ```
2.  **Environment Setup:**
    Create a `.env` file and configure your keys (Clerk, Database URL, Cloudinary).
3.  **Database Sync:**
    ```bash
    npx prisma db push
    npx prisma generate
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🇹🇷 TR - Proje Özeti ve Amaç

### 🎯 Hedef
Temel amacımız, basit bir ürün listeleme sitesinin ötesine geçerek **üretime hazır (production-ready) bir e-ticaret altyapısı** kurmaktır. Aşağıdaki özellikleri barındıran dinamik bir ekosistem oluşturmayı hedefliyoruz:
1.  **Tam Yönetim:** Ürünleri, kategorileri, varyasyonları (renk, beden vb.) ve mağaza ayarlarını merkezi bir Yönetim Panelinden kontrol edebilme.
2.  **Kolay Ölçeklenme:** Tek bir hesap altında birden fazla mağazayı yönetebilme desteği (Multi-tenant mimari).
3.  **Modern Kullanıcı Deneyimi:** Bento Grid tasarımları, dinamik navigasyon ve akıcı ödeme süreçleri ile müşterilere üst düzey bir alışveriş deneyimi sunma.

### ✨ Öne Çıkan Özellikler
* **Çoklu Mağaza Desteği:** Tek bir panelden birbirinden bağımsız birden fazla mağazayı yönetin.
* **Dinamik CMS (İçerik Yönetimi):** Billboardlar, Kategoriler, Ürünler ve Niteliklerin (Renk/Beden) gerçek zamanlı yönetimi.
* **Modern Arayüz:**
    * **Bento Grid Tasarımı:** Özellikleri sergilemek için modern, Apple tarzı kutucuk yapısı.
    * **Dinamik Navbar:** Logo ve sosyal medya linklerinin doğrudan admin panelinden değiştirilebilmesi.
    * **Floating Contact:** WhatsApp ve Telefon desteği için minimalist, açılır kapanır hızlı iletişim butonu.
* **Güçlü Altyapı:** Hız ve SEO optimizasyonu için Next.js 15+ Server Actions ile geliştirildi.
* **Güvenli Kimlik Doğrulama:** Clerk entegrasyonu ile güvenli kullanıcı yönetimi.
* **Veritabanı:** Prisma ORM ve PostgreSQL ile güvenli ve hızlı veri yönetimi.

### 🛠 Kullanılan Teknolojiler
* **Çatı (Framework):** Next.js 15 (App Router)
* **Dil:** TypeScript
* **Stil:** Tailwind CSS & Shadcn UI
* **Veritabanı:** PostgreSQL & Prisma ORM
* **Kimlik Doğrulama:** Clerk
* **Görsel Yönetimi:** Cloudinary

### 🚀 Kurulum

1.  **Paketleri Yükleyin:**
    ```bash
    npm install
    ```
2.  **Ortam Değişkenleri:**
    `.env` dosyasını oluşturun ve gerekli anahtarları (Clerk, Database URL, Cloudinary) girin.
3.  **Veritabanını Eşitleyin:**
    ```bash
    npx prisma db push
    npx prisma generate
    ```
4.  **Projeyi Başlatın:**
    ```bash
    npm run dev
    ```