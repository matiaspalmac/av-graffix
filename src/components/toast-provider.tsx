"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={true}
      duration={4000}
      theme="system"
      visibleToasts={5}
    />
  );
}
