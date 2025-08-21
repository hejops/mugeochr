// installing tailwind -and- shadcn is a shocking amount of busywork; can this
// be scripted?
//
// https://tailwindcss.com/docs/installation/using-vite
// 1. pnpm add tailwindcss @tailwindcss/vite
// 2. vite.config.ts: import and use plugin-react (sed-able)
// 3. src/index.css: sed 'i@import "tailwindcss";'
//
// https://ui.shadcn.com/docs/installation/vite
// (4. pnpm add tailwindcss @tailwindcss/vite)
// 5. tsconfig.json, tsconfig.app.json: baseUrl, paths (jq)
// 6. pnpm add -D @types/node
// 7. vite.config.ts: add resolve (sed-able, barely)
// 8. npx shadcn@latest init
//
// 9. npx shadcn@latest add <component>

import "./index.css"; // if omitted, map does not appear at all
import "leaflet/dist/leaflet.css"; // if omitted, produces fragmented tiles!
import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Slider } from "@/components/ui/slider"; // equivalent to "./components/ui/slider.tsx"
import { getLivingComposers } from "./db.ts";
import MapComponent from "./map.tsx";

// TODO: bundle with vite

function App() {
  // {{{
  /*
  const [input, setInput] = useState<string>(); // growable string (1)
  const [searchTerm, setSearchTerm] = useState<string>(); // intermediate string (2)
  const [place, setPlace] = useState<string>(); // final string (3)

  // component funcs cannot be async; async funcs must be declared inside a
  // useEffect
  // https://react.dev/reference/react/useEffect#fetching-data-with-effects
  // https://stackoverflow.com/a/57856876
  useEffect(() => {
    type PhotonResult = {
      name: string;
      coords: [number, number];
    };
    // React advises to declare the async function directly inside useEffect
    async function photon(s?: string) {
      if (!s) return;
      const url = `https://photon.komoot.io/api?q=${s.replace(" ", "%20")}&limit=10&lang=en`;
      const res: PhotonResult = await fetch(url).then(async (r) =>
        (await r.json()).features
          .map((x: any) => {
            return {
              name: x.properties.name,
              coords: x.geometry.coordinates.reverse(), // lnglat
            };
          })
          .find((x: PhotonResult) => x.name.toLowerCase() === s),
      );
      // setPlace(x.coords.toString());
      // alert(`setting place to ${res.name} ${res.coords}`);
      setPlace(res.name);
      setCenter(res.coords);
    }

    photon(searchTerm);
  }, [searchTerm]);
  */
  // }}}

  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(1700);

  // const [composers, setComposers] = useState<Composer[]>([]);
  // useEffect(() => setComposers(getLivingComposers(year)), [year]);

  const composers = useMemo(() => getLivingComposers(year), [year]);

  const divCenter = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  } as const;

  return (
    <>
      {/*
      <form
        // https://github.com/alexeagleson/nextjs-fullstack-app-template/blob/8e788edb85b0e/README.app.md?plain=1#L505
        onSubmit={(e) => {
          e.preventDefault(); // otherwise page is reloaded

          setSearchTerm(input);
          setInput("");
        }}
      >
        <input
          type="text"
          placeholder="london"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
	*/}

      <div style={divCenter}>
        <MapComponent composers={composers} />
      </div>

      <br />

      <div style={{ ...divCenter, width: "33%" }}>
        <Slider
          defaultValue={[year]}
          min={1301}
          max={thisYear}
          step={1}
          onValueChange={(v) => setYear(v[0])}
        />
      </div>

      <br />

      <div style={divCenter}>Year: {year}</div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
