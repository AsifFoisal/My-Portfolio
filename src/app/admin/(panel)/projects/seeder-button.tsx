"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { seedProjects } from "./actions";
import { useToast } from "../../toast";

export default function SeederButton() {
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="admin-btn small primary"
      type="button"
      disabled={pending}
      style={{ display: "inline" }}
      onClick={() =>
        startTransition(async () => {
          try {
            await seedProjects();
            toast("Sample projects added", "ok");
            router.refresh();
          } catch (err) {
            toast(err instanceof Error ? err.message : "Seeding failed", "err");
          }
        })
      }
    >
      {pending ? "Loading…" : "Load the 4 sample projects"}
    </button>
  );
}
