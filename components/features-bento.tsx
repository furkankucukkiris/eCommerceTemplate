import { Truck, ShieldCheck, RefreshCw, Headphones, ArrowRight } from "lucide-react";

export const FeaturesBento = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        
        {/* 1. KUTU: BÜYÜK GÖRSEL (SOL ÜST) */}
        <div className="group relative overflow-hidden rounded-3xl bg-gray-100 md:col-span-2 shadow-sm border border-gray-200/50">
          <div className="absolute inset-0">
            {/* Arkaplan Resmi */}
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
              alt="Collection" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Karartma */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Yeni Sezonu Keşfet</h3>
            <p className="text-gray-200 text-sm max-w-md mb-4">
              Minimalist çizgiler, doğal dokular ve sürdürülebilir kumaşlarla hazırlanan yeni koleksiyonumuz şimdi yayında.
            </p>
            <button className="flex items-center text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-all">
              İncelemeye Başla <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 2. KUTU: İKON & SERVİS (SAĞ ÜST) */}
        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="mb-6 rounded-full bg-blue-50 p-4 transition-colors group-hover:bg-blue-100">
            <Truck className="h-8 w-8 text-blue-600 transition-transform duration-500 group-hover:-translate-x-1 group-hover:scale-110" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Aynı Gün Kargo</h4>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Saat 14:00'e kadar verilen siparişleriniz aynı gün kargoya teslim edilir. Hızlı ve güvenilir.
          </p>
        </div>

        {/* 3. KUTU: İKON & GÜVENLİK (SOL ALT) */}
        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="mb-6 rounded-full bg-green-50 p-4 transition-colors group-hover:bg-green-100">
            <ShieldCheck className="h-8 w-8 text-green-600 transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Güvenli Ödeme</h4>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            256-bit SSL sertifikası ve 3D Secure altyapısı ile ödemeleriniz %100 güvence altında.
          </p>
        </div>

        {/* 4. KUTU: BÜYÜK GÖRSEL (SAĞ ALT) */}
        <div className="group relative overflow-hidden rounded-3xl bg-gray-900 md:col-span-2 shadow-sm border border-gray-800">
           <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop" 
              alt="Quality" 
              className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
          </div>

          <div className="absolute inset-0 p-8 flex flex-col justify-center items-start text-white">
             <div className="flex items-center gap-2 mb-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-white/20">
                <RefreshCw className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-100">Kolay İade</span>
             </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Memnuniyet Garantisi</h3>
            <p className="text-gray-300 text-sm max-w-sm mb-6">
              Ürünümüzü beğenmediniz mi? 14 gün içinde koşulsuz şartsız iade edebilir veya değişim yapabilirsiniz.
            </p>
             <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
              İade Koşulları <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};