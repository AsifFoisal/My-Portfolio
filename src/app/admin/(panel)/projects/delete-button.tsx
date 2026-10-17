"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "./actions";
import { useToast } from "../../toast";

export default function DeleteButton({ id, label }: { id: string; label?: string }) {
  const toast = useToast();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <button
      className={"admin-btn small danger" + (confirming ? " confirming" : "")}
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirming) {
          setConfirming(true);
          window.setTimeout(() => setConfirming(false), 4000);
          return;
        }
        startTransition(async () => {
          try {
            await deleteProject(id);
            toast("Project deleted", "ok");
            router.refresh();
          } catch (err) {
            toast(err instanceof Error ? err.message : "Delete failed", "err");
          }
        });
      }}
    >
      {pending ? "…" : confirming ? "Confirm?" : (label ?? "Delete")}
    </button>
  );
}
