import type { Metadata } from "next";
import { ClientFulfillmentJobPage } from "@/components/ClientPages";

export const metadata: Metadata = {
  title: "Tuyển dụng Fulfillment Full-time - GoBeyond LLC",
  description: "JD chi tiết vị trí Fulfillment Full-time tại GoBeyond.",
};

export default function FulfillmentRoute() {
  return <ClientFulfillmentJobPage />;
}
