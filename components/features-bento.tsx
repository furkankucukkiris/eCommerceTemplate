import { Truck, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

export const FeaturesBento = () => {
  return (
    <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-20 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Büyük Kutu - Sol */}
        <div className="group relative overflow-hidden rounded-2xl bg-slate-100 p-8 md:col-span-2 min-h-[300px] flex flex-col justify-between hover:shadow-lg transition-all duration-300">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Premium Üyelik</h3>
            <p className="text-slate-500 mt-2 max-w-sm">Özel indirimler, erken erişim ve ücretsiz kargo fırsatlarını kaçırma.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] h-32 w-32 bg-black rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500" />
          <button className="mt-4 w-fit flex items-center text-sm font-medium text-slate-900 group-hover:underline">
            Detayları İncele <ArrowUpRight className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Küçük Kutu - Sağ Üst */}
        <div className="group bg-black text-white rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:bg-gray-900 transition-colors">
          <div className="bg-gray-800 p-3 rounded-full mb-4 group-hover:rotate-12 transition-transform">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-bold text-lg">Hızlı Teslimat</h4>
          <p className="text-gray-400 text-sm mt-1">81 ilde 24 saatte kargoda.</p>
        </div>

        {/* Küçük Kutu - Sol Alt */}
        <div className="group bg-slate-100 rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:bg-slate-200 transition-colors">
          <div className="bg-white p-3 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-bold text-lg text-slate-900">Güvenli Ödeme</h4>
          <p className="text-slate-500 text-sm mt-1">256-bit SSL koruması.</p>
        </div>

        {/* Geniş Kutu - Sağ Alt */}
        <div className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10">
                <h3 className="text-2xl font-bold">Mobil Uygulama</h3>
                <p className="text-indigo-100 mt-1">Yakında App Store ve Play Store'da.</p>
            </div>
            <Zap className="h-12 w-12 text-white/30 absolute right-4 -bottom-2 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500" />
        </div>

      </div>
    </div>
  );
};