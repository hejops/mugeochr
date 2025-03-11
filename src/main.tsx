import "./index.css";
import "leaflet/dist/leaflet.css"; // if omitted, produces fragmented tiles!
import MyMap from "./map.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MyMap />
  </StrictMode>,
);
