import { permanentRedirect } from "next/navigation";

export default function LegacyFulfillmentRoute() {
  permanentRedirect("/careers/fulfillment-full-time");
}
