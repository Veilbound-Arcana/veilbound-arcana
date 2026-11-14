import React from "react";
import { S07CardDetail } from "@/screens/S07CardDetail";
import { RouteParamsProvider } from "@/lib/router";

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RouteParamsProvider params={{ id }}>
      <S07CardDetail />
    </RouteParamsProvider>
  );
}
