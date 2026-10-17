"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setInquiryRead, deleteInquiry } from "./actions";
import { useToast } from "../../toast";

export default function InquiryRowActions({ id, isRead }: { id: string; isRead: boolean }) {
  const toast = useToast();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        className="admin-btn small"
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await setInquiryRead(id, !isRead);
              toast(isRead ? "Marked as unread" : "Marked as read", "ok");
              router.refresh();
            } catch (err) {
              toast(err instanceof Error ? err.message : "Update failed", "err");
            }
          })
        }
      >
        {pending ? "…" : isRead ? "Mark unread" : "Mark read"}
      </button>
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
              await deleteInquiry(id);
              toast("Inquiry deleted", "ok");
              router.refresh();
            } catch (err) {
              toast(err instanceof Error ? err.message : "Delete failed", "err");
            }
          });
        }}
      >
        {pending ? "…" : confirming ? "Confirm?" : "Delete"}
      </button>
    </div>
  );
}
