import axios from "axios";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../firebase/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// const API_URL = "http://127.0.0.1:8000/api/v1";
const API_URL = "https://car-backendv1.onrender.com/api/v1";



// ======================================================
// Request Notification Permission
// ======================================================

export async function requestNotificationPermission() {

    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {

            console.log("Notification permission denied");

            return null;

        }

        const messaging = await getFirebaseMessaging();

        if (!messaging) return null;

        const token = await getToken(messaging, {

            vapidKey: VAPID_KEY,

        });

        console.log("FCM Token:", token);

        return token;

    } catch (err) {

        console.error("Notification Error:", err);

        return null;

    }

}


// ======================================================
// Save Token in Backend
// ======================================================

export async function saveNotificationToken(token) {

    try {

        const response = await axios.post(

            `${API_URL}/notifications/register`,

            {

                token,

                browser: navigator.userAgent,

                device: navigator.platform,

                platform: "Web",

            }

        );

        console.log("✅ Token Saved:", response.data);

        return response.data;

    } catch (err) {

        console.error(

            "❌ Token Save Error:",

            err.response?.data || err.message

        );

        return null;

    }

}


// ======================================================
// Foreground Notification
// ======================================================

export async function listenForegroundNotification() {

    const messaging = await getFirebaseMessaging();

    if (!messaging) return;

    onMessage(messaging, (payload) => {

        console.log("📩 Foreground Notification:", payload);

        // Browser notification manually create karu naka.
        // Service Worker background notification handle karel.

    });

}