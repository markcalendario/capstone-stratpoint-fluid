import { UserSchema } from "@/types/users";
import Image from "next/image";

interface UserImagesStack {
  show: number;
  images: UserSchema["imageUrl"][];
}

export default function UserImagesStack({ images, show }: UserImagesStack) {
  return (
    <div className="flex items-center gap-1 -space-x-3">
      {images.slice(0, show).map((image, i) => (
        <Image
          key={i}
          width={25}
          height={25}
          alt={`user ${i}`}
          src={image}
          className="outline-primary/20 rounded-full outline"
        />
      ))}

      {images.length > show && (
        <div className="bg-primary flex h-[25px] w-[25px] items-center justify-center rounded-full text-[10px] font-medium text-white">
          +{images.length - show}
        </div>
      )}
    </div>
  );
}
