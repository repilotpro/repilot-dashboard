"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchJson } from "@/lib/fetchJson";
import { Property } from "@/lib/mockData";
import OverviewTab from "@/components/tabs/OverviewTab";
import ListingHistoryTab from "@/components/tabs/ListingHistoryTab";
import SchoolsTab from "@/components/tabs/SchoolsTab";
import CommunityTab from "@/components/tabs/CommunityTab";
import PlacesTab from "@/components/tabs/PlacesTab";
import ImageCarouselModal from "@/components/ImageCarouselModal";
import { useAuth } from "@/components/AuthProvider";

type TabType = "overview" | "listing-history" | "comparables" | "schools" | "community" | "places";

export default function PropertyDetailPage() {
  const params = useParams();
  const mlsNumber = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!mlsNumber || authLoading || !user) return;

    let active = true;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { ok, data } = await fetchJson<{ property: Property }>(`/api/properties/${mlsNumber}`);
        if (!active) return;
        if (!ok) {
          throw new Error("Property not found");
        }
        setProperty(data.property);
        setHeroIndex(0);
      } catch (err: unknown) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Failed to load property";
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProperty();
    return () => {
      active = false;
    };
  }, [mlsNumber, authLoading, user]);

  if (authLoading || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-[#5d6f87]">Loading this home…</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-[#10233f]">{error || "Property not found"}</p>
        <Link href="/" className="text-sm font-extrabold text-[#245f92]">
          Back to search
        </Link>
      </div>
    );
  }

  const images = (property.images || []).filter((img) => img && img.trim() !== "");
  const hero = images[heroIndex] || property.image;
  const thumbs = images.slice(0, 6);
  const parkingLabel = property.parkingTotal
    ? `${property.parkingTotal} parking`
    : property.garage
      ? `${property.garage} garage`
      : "No parking";

  const specs = [
    { label: "Beds", value: String(property.bedrooms) },
    { label: "Baths", value: String(property.bathrooms) },
    { label: "Parking", value: parkingLabel },
    { label: "Status", value: property.mlsStatus || property.statusChange || "—" },
    { label: "Days listed", value: String(property.daysOnMarket ?? "—") },
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "listing-history", label: "Listing History" },
    { id: "comparables", label: "Comparables" },
    { id: "schools", label: "Schools" },
    { id: "community", label: "Community" },
    { id: "places", label: "Places" },
  ];

  const openGallery = (index: number) => {
    setInitialImageIndex(index);
    setHeroIndex(index);
    setIsImageModalOpen(true);
  };

  const stepHero = (direction: number) => {
    if (images.length === 0) return;
    setHeroIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <Link
          href="/"
          className="rounded-full border border-[rgba(18,54,95,0.14)] bg-white px-4 py-2 text-sm font-extrabold text-[#12365f]"
        >
          ← Back to search
        </Link>
      </div>

      <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-[rgba(21,45,78,0.12)] bg-[#d5e4e9] shadow-[0_28px_70px_rgba(30,64,105,0.16)] sm:min-h-[420px]">
        {hero ? (
          <Image src={hero} alt={property.address} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-[#5d6f87]">
            No photo
          </div>
        )}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => stepHero(-1)}
              className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-[rgba(8,18,35,0.55)] text-3xl text-white backdrop-blur"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => stepHero(1)}
              className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-[rgba(8,18,35,0.55)] text-3xl text-white backdrop-blur"
            >
              ›
            </button>
          </>
        ) : null}
        <div className="absolute bottom-5 left-5">
          <span className="rounded-full bg-[rgba(9,20,38,0.72)] px-3 py-1.5 text-xs font-extrabold text-[#dff8ff]">
            {images.length ? `${heroIndex + 1} / ${images.length}` : "0 photos"}
          </span>
        </div>
      </div>

      {thumbs.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {thumbs.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => openGallery(index)}
              className={`relative h-20 overflow-hidden rounded-2xl border ${
                index === heroIndex ? "border-[#ffab45]" : "border-white/40"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <article className="glass-card mt-6 p-6 sm:p-8">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#2b95b8]">
          {[property.city, property.area].filter(Boolean).join(" · ") || "Listing"}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[#10233f] sm:text-4xl">
            {property.address}
          </h1>
          <p className="text-3xl font-semibold tracking-[-0.03em] text-[#10233f]">
            ${property.price.toLocaleString()}
          </p>
        </div>
        {property.buildingType ? (
          <p className="mt-2 text-sm font-semibold text-[#5d6f87]">{property.buildingType}</p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-2xl border border-[rgba(18,54,95,0.1)] bg-[rgba(18,54,95,0.04)] px-4 py-3"
            >
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#687a91]">
                {spec.label}
              </span>
              <b className="mt-1 block text-sm text-[#10233f]">{spec.value}</b>
            </div>
          ))}
        </div>

        <nav className="mt-8 flex gap-6 overflow-x-auto border-b border-[rgba(21,45,78,0.1)]" aria-label="Property sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 border-b-2 pb-3 text-sm font-extrabold ${
                activeTab === tab.id
                  ? "border-[#12365f] text-[#12365f]"
                  : "border-transparent text-[#6b7e95]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-6">
          {activeTab === "overview" && <OverviewTab property={property} />}
          {activeTab === "listing-history" && <ListingHistoryTab property={property} />}
          {activeTab === "schools" && <SchoolsTab property={property} />}
          {activeTab === "community" && <CommunityTab property={property} />}
          {activeTab === "places" && <PlacesTab property={property} />}
          {activeTab === "comparables" && (
            <p className="text-sm text-[#5d6f87]">Comparable listings will show here.</p>
          )}
        </div>
      </article>

      {images.length > 0 && (
        <ImageCarouselModal
          images={images}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          initialIndex={initialImageIndex}
        />
      )}
    </div>
  );
}
