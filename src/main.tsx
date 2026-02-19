import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthGate } from "./components/AuthGate";
import { SafeView } from "./components/SafeView";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <SafeView>
    <AuthGate>
      <App />
    </AuthGate>
  </SafeView>
);