import { MapContainer, TileLayer } from 'react-leaflet';

const GroundwaterMap = () => {
  return (
    <div className="h-full w-full rounded-2xl border border-slate-800 bg-slate-900/60 min-h-[320px]">
      <MapContainer
        className="h-full w-full"
        center={[35.57, 53.39]}
        zoom={8}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
};

export default GroundwaterMap;
