"use client";

import Link from "next/link";
import Image from "next/image";
import { Property } from "@/lib/mockData";
import { useAuth } from "@/components/AuthProvider";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const status = property.statusChange || property.mlsStatus;
  const { user, loading, openLogin } = useAuth();
  const href = `/property/${property.mlsNumber || property.id}`;

  return (
    <Link
      href={user ? href : "/"}
      className="group block"
      onClick={(event) => {
        if (loading || user) return;
        event.preventDefault();
        openLogin();
      }}
    >
      <article className="overflow-hidden rounded-[22px] border border-[rgba(21,45,78,0.12)] bg-white/90 shadow-[0_18px_40px_rgba(30,64,105,0.08)] transition duration-200 group-hover:-translate-y-1 group-hover:border-[rgba(67,166,202,0.7)]">
        <div className="relative h-52 w-full bg-[#e7eef5]">
          {property.image ? (
            <Image
              src={property.image}
              alt={property.address}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-[#6b7e95]">
              No photo
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {status ? (
              <span className="rounded-full bg-[#12365f] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                {status}
              </span>
            ) : null}
            {property.transactionType ? (
              <span className="rounded-full border border-[rgba(255,171,69,0.55)] bg-[#fff7ed] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#9b5300]">
                {property.transactionType}
              </span>
            ) : null}
          </div>
          {property.imageCount ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-[rgba(9,20,38,0.72)] px-2.5 py-1 text-[10px] font-extrabold text-white">
              {property.imageCount} photos
            </span>
          ) : null}
        </div>
        <div className="grid gap-2 p-4">
          <p className="text-[22px] font-semibold tracking-[-0.03em] text-[#10233f]">
            ${property.price.toLocaleString()}
          </p>
          <h3 className="truncate text-sm font-extrabold text-[#10233f]">{property.address}</h3>
          <p className="text-xs font-semibold text-[#5d6f87]">
            {property.bedrooms} bed · {property.bathrooms} bath
            {property.city ? ` · ${property.city}` : ""}
          </p>
        </div>
      </article>
    </Link>
  );
}
