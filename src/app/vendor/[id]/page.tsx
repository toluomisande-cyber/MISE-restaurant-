import { VENDORS } from "@/lib/data/mockData";
import { VendorDetailClient } from "./VendorDetailClient";

export function generateStaticParams() {
  return VENDORS.map((vendor) => ({
    id: vendor.id,
  }));
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VendorDetailClient vendorId={id} />;
}
