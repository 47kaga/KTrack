import Image from "next/image";
import Link from "next/link";

export function LogoBrand() {
  return (
    <Link href="/" className="flex items-center shrink-0" aria-label="K-Track home">
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={40}
        className="h-8 w-auto object-contain object-left"
        priority
      />
    </Link>
  );
}
