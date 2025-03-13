import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import MyMap from "./map.tsx";

// installing tailwind -and- shadcn is a shocking amount of busywork; can this
// be scripted?
//
// https://tailwindcss.com/docs/installation/using-vite
// 1. yarn add tailwindcss @tailwindcss/vite
// 2. vite.config.ts: import and use plugin (sed-able)
// 3. src/index.css: @import "tailwindcss"; on top
//
// https://ui.shadcn.com/docs/installation/vite
// 4. yarn add tailwindcss @tailwindcss/vite
// 5. tsconfig.json, tsconfig.app.json (jq)
// 6. yarn add -D @types/node
// 7. vite.config.ts: add resolve (sed-able, barely)
// 8. npx shadcn@latest init
// 9. npx shadcn@latest add <component>

// npx shadcn@latest add slider
import { Slider } from "@/components/ui/slider"; // equivalent to "./components/ui/slider.tsx"

import "./index.css"; // if omitted, map does not appear at all
import "leaflet/dist/leaflet.css"; // if omitted, produces fragmented tiles!

function App() {
  const [sliderValue, setState] = useState(1500);

  return (
    <>
      <h1>Map</h1>
      <MyMap value={sliderValue} />

      <br />

      <h2>Year</h2>
      <Slider //
        defaultValue={[sliderValue]}
        min={1100}
        max={2000 /* TODO: current year? */}
        step={1}
        onValueChange={(v) => setState(v[0])}
      />
      {sliderValue}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
