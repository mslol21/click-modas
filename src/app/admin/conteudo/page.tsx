import React from "react";
import { Metadata } from "next";
import { getBanners, getInstitutional } from "@/lib/data";
import { ContentClient } from "./content-client";

export const metadata: Metadata = {
  title: "Conteúdo e Banners | Admin Click Modas 25",
};

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const banners = await getBanners();
  const institutional = await getInstitutional();

  return (
    <ContentClient
      initialBanners={banners}
      initialInstitutional={institutional}
    />
  );
}
