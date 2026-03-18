import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

const isProductionBuild = import.meta.env.PROD;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    if (isProductionBuild) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations().catch(() => []);
    await Promise.all(registrations.map((registration) => registration.unregister()));

    const cacheKeys = await caches.keys().catch(() => []);
    await Promise.all(cacheKeys.map((key) => caches.delete(key)));
  });
}
