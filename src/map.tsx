import type { LatLngTuple } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import type { Composer } from "./db";

const london: LatLngTuple = [51.505, -0.09];
const eisenach: LatLngTuple = [50.976111, 10.320556];

// https://leafletjs.com/examples/quick-start/example.html
// https://react-leaflet.js.org/docs/api-map/#mapcontainer
// https://react-leaflet.js.org/docs/start-setup/

// https://github.com/Netizen-Teknologi/react-native-maps-leaflet/blob/13ec1e9aa2563f1a540bef6e5fe3ffe96a396bb2/MapView.tsx#L32
// https://legacy.reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized
// components cannot return void
function RecenterMap({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  // TODO: average of all composers coords (reduce wild shifting)
  useMap().setView(center, zoom);
  return undefined;
}

function formatDates(c: Composer) {
  const by = c.dob.split("-", 1)[0];
  if (!c.dod) return `B: ${by}`;
  const dy = c.dod.split("-", 1)[0];
  return `${by} - ${dy}`;
}

function Markers({ composers }: { composers?: Composer[] }) {
  if (!composers) return null;

  return composers.map((c) => (
    <Marker position={c.birthplace} key={"c-" + c.name.toLowerCase()}>
      <Popup>
        {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target */}
        <a href={c.article} target="_blank" rel="noopener noreferrer">
          <b>{c.name}</b>
        </a>
        <br />
        <div style={{ textAlign: "center" }}>({formatDates(c)})</div>
      </Popup>
    </Marker>
  ));
}

function meanLatLng(coords?: LatLngTuple[]): LatLngTuple {
  if (!coords) return eisenach;
  let lat = 0;
  let lng = 0;
  for (const c of coords) {
    lat += c[0];
    lng += c[1];
  }
  lat /= coords.length;
  lng /= coords.length;
  return [lat, lng];
}

// since this is the default function, its name can theoretically be anything
// (even lowercase)
export default function MapComponent({
  center,
  composers,
}: {
  center: LatLngTuple;
  composers?: Composer[];
}) {
  const [lat, lng] = center;
  return (
    <MapContainer
      center={center}
      zoom={4} // europe
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <RecenterMap
        center={meanLatLng(composers?.map((c) => c.birthplace as LatLngTuple))}
        zoom={4}
      />

      {/* 
	{s} means one of the available subdomains (used sequentially to help
	with browser parallel requests per domain limitation; subdomain values
	are specified in options; a, b or c by default, can be omitted), {z} —
	zoom level, {x} and {y} — tile coordinates. {r} can be used to add
	"@2x" to the URL to load retina tiles.

	in practice, the defaults can be left as-is

	https://leafletjs.com/reference.html#tilelayer 
	*/}
      <TileLayer url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`} />
      <Markers composers={composers} />
    </MapContainer>
  );
}
