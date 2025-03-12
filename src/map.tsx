import type { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

const position: LatLngTuple = [51.505, -0.09];

// https://leafletjs.com/examples/quick-start/example.html
// https://react-leaflet.js.org/docs/api-map/#mapcontainer
// https://react-leaflet.js.org/docs/start-setup/

// since this is the default function, its name can theoretically be anything
// (even lowercase)
export default function MyMap() {
  return (
    <>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        {/* 
	{s} means one of the available subdomains (used sequentially to help
	with browser parallel requests per domain limitation; subdomain values
	are specified in options; a, b or c by default, can be omitted), {z} —
	zoom level, {x} and {y} — tile coordinates. {r} can be used to add
	"@2x" to the URL to load retina tiles.

	in practice, the defaults can be left as-is

	https://leafletjs.com/reference.html#tilelayer 
	*/}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            <b>Hello world!</b>
            <br />I am a popup.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
