import React from "react";
import { Metadata } from "next";
import { getStoreSettings } from "@/lib/data";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Configurações da Loja | Admin Click Modas 25",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return <SettingsClient settings={settings} />;
}
