import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const StoreHero = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-8">
      {/* Arkaplan Efekti (Gradient Blob) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[50%] -left-[20%] w-[70%] h-[70%] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-[50%] -right-[20%] w-[70%] h-[70%] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 text-sm text-gray-300 backdrop-blur-xl mb-6">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Yeni Sezon Stoklarda
        </div>
        
        <h1 className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          TARZINI <br className="hidden sm:block" /> YANSIT.
        </h1>
        
        <p className="mt-6 max-w-lg text-lg text-gray-400 sm:text-xl">
          Minimalist tasarımlar, sürdürülebilir materyaller ve geleceğin modası şimdi tek bir platformda.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-200 px-8 h-12">
            Alışverişe Başla
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full border-gray-700 text-black hover:bg-gray-800 hover:text-white h-12">
            Koleksiyonları Gör
          </Button>
        </div>
      </div>
    </div>
  );
};