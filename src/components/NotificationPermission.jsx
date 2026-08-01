import { useEffect, useRef } from "react";

import {
    requestNotificationPermission,
    saveNotificationToken,
    listenForegroundNotification,
} from "../services/notificationService";

export default function NotificationPermission() {

    // Prevent duplicate initialization
    const initialized = useRef(false);

    useEffect(() => {

        if (initialized.current) {
            return;
        }

        initialized.current = true;

        async function init() {

            try {

                const token = await requestNotificationPermission();

                if (!token) return;

                console.log("Generated Token:", token);

                // Save token only once
                await saveNotificationToken(token);

                // Listen for foreground notifications
                await listenForegroundNotification();

            } catch (err) {

                console.error("Notification Init Error:", err);

            }

        }

        init();

    }, []);

    return null;
}