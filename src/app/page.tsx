import { Suspense } from "react";
import Portfolio from "@/components/Portfolio";
import { getPublicData } from "@/lib/site";

async function PortfolioWithData() {
  // per-request read so admin changes appear on refresh;
  // connection() marks this dynamic and keeps the page cacheable as a shell
  const { connection } = await import("next/server");
  await connection();
  const { projects, settings } = await getPublicData();
  return <Portfolio projects={projects} settings={settings} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <PortfolioWithData />
    </Suspense>
  );
}
