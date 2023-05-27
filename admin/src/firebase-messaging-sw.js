importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAQC7Guhjn6k7I4YKu6QhJ7u8MiSqBr-S0",
  authDomain: "restaurant-6f539.firebaseapp.com",
  projectId: "restaurant-6f539",
  storageBucket: "restaurant-6f539.appspot.com",
  messagingSenderId: "1005655226277",
  appId: "1:1005655226277:web:a41337d8c83713a57e1a4c",
  measurementId: "G-9ST9J05RW3"
});
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/logo.png',
    // Add more options here
  };
});



