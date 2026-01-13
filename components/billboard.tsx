interface BillboardProps {
  data: {
    label: string;
    description?: string;
    imageUrl?: string; // Şimdilik opsiyonel yapalım, resim yoksa gradient kullanırız
  };
}

export const Billboard: React.FC<BillboardProps> = ({
  data
}) => {
  return ( 
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
      <div 
        className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
        style={{ backgroundImage: data.imageUrl ? `url(${data.imageUrl})` : 'none' }}
      >
        {/* Resim yoksa gösterilecek Gradient Arkaplan (AFK Tarzı) */}
        {!data.imageUrl && (
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900" />
        )}

        <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8 relative z-10">
          <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs text-white drop-shadow-md">
            {data.label}
          </div>
          {data.description && (
             <p className="text-lg text-gray-200 max-w-lg">{data.description}</p>
          )}
        </div>
      </div>
    </div>
   );
}