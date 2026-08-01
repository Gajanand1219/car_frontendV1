importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCV9A4Lyr80U0i_GKPuDByDXpUHzLJMjbg",
    authDomain: "test-97e17.firebaseapp.com",
    projectId: "test-97e17",
    storageBucket: "test-97e17.firebasestorage.app",
    messagingSenderId: "729693180482",
    appId: "1:729693180482:web:cd1bcc68e6547b0dcb13db",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    self.registration.showNotification(
        payload.data.title,
        {
            body: payload.data.body,
            image: payload.data.image,
            icon: "/favicon.ico",
            data: {
                url: payload.data.url,
            },
            requireInteraction: true,
        }
    );

});

self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );

});