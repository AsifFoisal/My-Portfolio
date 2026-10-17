import { Suspense } from "react";
import { connection } from "next/server";
import { getSettings } from "@/lib/site";
import SettingsForm from "./settings-form";

async function Loader() {
  await connection();
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}

export default function SettingsPage() {
  return (
    <>
      <h1>Settings</h1>
      <p className="admin-sub">contact details, social links, hero roles and stats</p>
      <Suspense fallback={<p className="admin-sub">loading…</p>}>
        <Loader />
      </Suspense>
    </>
  );
}
