"use client";

import {
  AlertCircle,
  AlertTriangle,
  Clock,
  Package,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

export interface Notification {
  id: string;
  type: "critical" | "warning" | "info";
  icon: "stock" | "payment" | "project" | "purchase_order";
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  count?: number;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

export default function NotificationCenter({
  notifications,
  onDismiss,
}: NotificationCenterProps) {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "stock":
        return <Package className="h-5 w-5" />;
      case "payment":
        return <TrendingDown className="h-5 w-5" />;
      case "project":
        return <Clock className="h-5 w-5" />;
      case "purchase_order":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-4 border-red-500 bg-red-50 text-red-900";
      case "warning":
        return "border-l-4 border-yellow-500 bg-yellow-50 text-yellow-900";
      case "info":
        return "border-l-4 border-blue-500 bg-blue-50 text-blue-900";
      default:
        return "border-l-4 border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg p-4 flex gap-4 items-start ${getStyles(notification.type)}`}
        >
          <div className="flex-shrink-0 mt-0.5 opacity-75">
            {getIcon(notification.icon)}
          </div>

          <div className="flex-grow">
            <div className="flex items-baseline gap-2">
              <h3 className="font-semibold text-sm">{notification.title}</h3>
              {notification.count && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-current bg-opacity-10">
                  {notification.count}
                </span>
              )}
            </div>
            <p className="text-sm opacity-75 mt-1">{notification.description}</p>

            {notification.action && (
              <Link
                href={notification.action.href}
                className="text-sm font-semibold mt-2 inline-block underline hover:opacity-75"
              >
                {notification.action.label} →
              </Link>
            )}
          </div>

          {onDismiss && (
            <button
              onClick={() => onDismiss(notification.id)}
              className="flex-shrink-0 text-current opacity-50 hover:opacity-75 transition-opacity"
            >
              <span className="sr-only">Descartar</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
