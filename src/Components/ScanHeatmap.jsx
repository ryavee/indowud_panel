import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet.heat";
import L from "leaflet";

const ScanHeatmap = ({ scanLocations }) => {

  const heatPoints =
    scanLocations?.map((scan) => [
      scan.latitude,
      scan.longitude,
      0.5
    ]) || [];

  const HeatLayer = () => {
    const map = window._leaflet_map;

    if (map && heatPoints.length > 0) {
      L.heatLayer(heatPoints, {
        radius: 25,
        blur: 20,
        maxZoom: 10,
      }).addTo(map);
    }

    return null;
  };

  return (
    <MapContainer
      center={[22.9734, 78.6569]} // India center
      zoom={5}
      style={{ height: "400px", width: "100%" }}
      whenCreated={(map) => {
        window._leaflet_map = map;
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <HeatLayer />

    </MapContainer>
  );
};

export default ScanHeatmap;