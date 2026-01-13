import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryTabProps {
  image: any;
  selected: boolean;
  onClick: () => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  image,
  selected,
  onClick
}) => {
  return ( 
    <div 
      onClick={onClick}
      className={cn(
        "relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white border-2 transition-all",
        selected ? "border-black" : "border-transparent"
      )}
    >
      <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
        <Image 
          fill 
          src={image.url} 
          alt="" 
          className="object-cover object-center" 
        />
      </span>
    </div>
  );
}