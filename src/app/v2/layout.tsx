import type { Metadata } from "next";
import "@/styles/logiswift-tokens.css";
import "@/styles/logiswift-v2.css";

export const metadata: Metadata = {
  title: "LogiSwift — Delivery, without the detours",
  description: "A clear, practical way to plan local parcel deliveries. LogiSwift 2.0 customer experience preview.",
};

export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="ls2">{children}</div>;
}
