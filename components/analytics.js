// analytics.js
// Tracks page views, clicks, downloads, and saves analytics to Firebase Firestore

// Import and initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility: Get today's date as YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Utility: Get country from IP (uses ipinfo.io)
async function getCountry() {
  try {
    const res = await fetch("https://ipinfo.io/json?token=YOUR_IPINFO_TOKEN");
    const data = await res.json();
    return data.country || "Unknown";
  } catch {
    return "Unknown";
  }
}

// Track analytics event
async function trackEvent(type, extra = {}) {
  const date = getToday();
  const country = await getCountry();
  const page = window.location.pathname;
  const docId = `${date}_${page.replace(/\//g, "_")}`;
  const ref = doc(db, "datas", docId);
  let docSnap = await getDoc(ref);
  let data = docSnap.exists() ? docSnap.data() : {
    date,
    page,
    countries: {},
    views: 0,
    clicks: 0,
    downloads: 0,
    events: [],
  };
  // Update country count
  data.countries[country] = (data.countries[country] || 0) + 1;
  // Update counters
  if (type === "view") data.views++;
  if (type === "click") data.clicks++;
  if (type === "download") data.downloads++;
  // Log event
  data.events.push({ type, time: new Date().toISOString(), ...extra });
  await setDoc(ref, data);
}

// Track page view
trackEvent("view");

// Track clicks
window.addEventListener("click", () => trackEvent("click"));

// Track downloads (assumes download buttons have .download-btn class)
document.querySelectorAll(".download-btn").forEach(btn => {
  btn.addEventListener("click", () => trackEvent("download", { btn: btn.outerHTML }));
});

export { trackEvent };
