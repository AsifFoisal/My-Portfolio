"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Kind = "ok" | "err" | "info";
type Toast = { id: number; msg: string; kind: Kind; leaving: boolean };

const ToastCtx = createContext<(msg: string, kind?: Kind) => void>(() => {});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback((msg: string, kind: Kind = "ok") => {
    const id = ++idRef.current;
    setItems((s) => [...s, { id, msg, kind, leaving: false }]);
    window.setTimeout(() => {
      setItems((s) => s.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      window.setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 240);
    }, 3400);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="admin-toast-wrap">
        {items.map((t) => (
          <div key={t.id} role="status" className={"admin-toast " + t.kind + (t.leaving ? " out" : "")}>
            <span className="t-ico">{t.kind === "err" ? "✕" : t.kind === "info" ? "ℹ" : "✓"}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
