import React from "react";
import { Metadata } from "next";
import { getAdminStats } from "@/lib/admin-data";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Painel de Controle | Click Modas 25",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return <DashboardClient stats={stats} />;
}
