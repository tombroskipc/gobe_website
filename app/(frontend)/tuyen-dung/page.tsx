import type { Metadata } from "next";
import { ClientCareersPage } from "@/components/ClientPages";

export const metadata: Metadata = {
  title: "Tuyển dụng - GoBeyond LLC",
  description: "Danh sách vị trí tuyển dụng đang mở tại GoBeyond.",
};

export default function CareersRoute() {
  return <ClientCareersPage />;
}
