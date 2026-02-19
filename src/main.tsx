import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { SafeView } from "./components/SafeView";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <SafeView>
    
      <App />
    
  </SafeView>
);