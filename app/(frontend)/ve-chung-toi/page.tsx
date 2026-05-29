import type { Metadata } from "next";
import { ClientAboutPage } from "@/components/ClientPages";

export const metadata: Metadata = {
  title: "Về chúng tôi - GoBeyond LLC",
  description:
    "Trang giới thiệu GoBeyond, những con số đã đạt được, tầm nhìn, sứ mệnh và hệ sinh thái nhãn hàng đồng hành.",
};

export default function AboutRoute() {
  return <ClientAboutPage />;
}
