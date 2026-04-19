import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-neutral-950 hover:shadow-xl">
      <div className="relative overflow-hidden bg-neutral-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={200}
          className="h-[200px] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full border border-neutral-950/10 bg-white/95 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-neutral-950 shadow-sm backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-bold text-neutral-950">
          {product.title}
        </h3>
        <p className="text-sm text-neutral-500">{product.brand}</p>
        <p className="text-xl font-black text-red-950">${product.price}</p>
        <div className="pt-1">
          <Link
            href={`/products/${product.id}`}
            className="block rounded-lg bg-neutral-950 py-2.5 text-center text-sm font-semibold text-white transition duration-200 hover:bg-red-950"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
