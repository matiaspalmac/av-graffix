"use client";

import { toast } from "sonner";

export const toastMessages = {
  // Success
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  // Error
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  },

  // Warning
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  // Info
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  // Loading
  loading: (message: string, id?: string) => {
    return toast.loading(message, { id });
  },

  // Update existing toast
  updateToast: (id: string | number, options: any) => {
    toast(options.message || "", {
      id,
      ...options,
    });
  },

  // Dismiss specific toast
  dismiss: (id?: string | number) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  },
};
