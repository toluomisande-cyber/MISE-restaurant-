import { OrderTrackingClient } from "./OrderTrackingClient";

export function generateStaticParams() {
  return [{ id: "ord-ui-101" }];
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderTrackingClient orderId={id} />;
}
