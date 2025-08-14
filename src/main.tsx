// installing tailwind -and- shadcn is a shocking amount of busywork; can this
// be scripted?
//
// https://tailwindcss.com/docs/installation/using-vite
// 1. pnpm add tailwindcss @tailwindcss/vite
// 2. vite.config.ts: import and use plugin (sed-able)
// 3. src/index.css: @import "tailwindcss"; on top
//
// https://ui.shadcn.com/docs/installation/vite
// 4. pnpm add tailwindcss @tailwindcss/vite
// 5. tsconfig.json, tsconfig.app.json (jq)
// 6. pnpm add -D @types/node
// 7. vite.config.ts: add resolve (sed-able, barely)
// 8. npx shadcn@latest init
// 9. npx shadcn@latest add <component>

import "./index.css"; // if omitted, map does not appear at all
import "leaflet/dist/leaflet.css"; // if omitted, produces fragmented tiles!
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; // equivalent to "./components/ui/slider.tsx"
import MapComponent from "./map.tsx";

function App() {
  const thisYear = new Date().getFullYear();

  const [sliderValue, setState] = useState(1685);
  const [place, setPlace] = useState<string>(); // final string
  const [input, setInput] = useState<string>(); // intermediate string

  return (
    <>
      <h1>Map: {place}</h1>

      <form
        // https://github.com/alexeagleson/nextjs-fullstack-app-template/blob/8e788edb85b0e776f0ebcd04cfe6072f81c606da/README.app.md?plain=1#L505
        onSubmit={(e) => {
          e.preventDefault(); // otherwise page is reloaded

          setPlace(input);
          setInput("");

          // TODO: fetch
          // curl 'https://photon.komoot.io/api?q=london%20bridge&limit=10&lang=en' | jq '.features[]|.properties.name'
        }}
      >
        <input
          type="text"
          placeholder="london"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>

      <MapComponent value={sliderValue} />

      <br />

      <h2>Year</h2>
      <Slider //
        defaultValue={[sliderValue]}
        min={1100}
        max={thisYear}
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
