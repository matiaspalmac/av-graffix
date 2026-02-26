"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand={true}
      duration={4000}
      theme="system"
      visibleToasts={3}
      gap={12}
      offset="16px"
      dir="ltr"
    />
  );
}
