import { getDashboardNotifications } from "@/app/erp/(protected)/actions/notifications";
import { NotificationsBell } from "./notifications-bell";

export async function NotificationsBellWrapper() {
    const notifications = await getDashboardNotifications();

    return <NotificationsBell notifications={notifications} />;
}
