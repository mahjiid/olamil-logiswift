import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import "@/styles/logiswift-tokens.css";
import "@/styles/logiswift-v2.css";

export const metadata: Metadata = {
  title: `${BRAND.productName} — From your door to theirs`,
  description: `Plan a local delivery with ${BRAND.productName}. This customer experience is a preview; no live bookings are submitted.`,
};

export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="ls2">{children}</div>;
}
