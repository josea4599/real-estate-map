"use client";

import { useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox";
//import Map, { NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type PropertyPin = {
  id: number;
  name: string;
  owner: string;
  price: string;
  address: string;
  latitude: number;
  longitude: number;
};

const properties: PropertyPin[] = [
  //This is example data for testing purposes and not accurate to real data.
  {
    id: 1,
    name: "Reframe Studios",
    owner: "Blueground Studios",
    price: "67,000,000",
    address: "4561 W Colorado Blvd, Los Angeles, CA",
    latitude: 34.1290,
    longitude: -118.2709,
  },
  {
  id: 2,
    name: "Casitas Studio",
    owner: "Blueground Studios",
    price: "$17,380,069",
    address: "2800 Casitas, Los Angeles, CA",
    latitude: 34.1094433,
    longitude: -118.247350,
  
  }

]

export default function MapView() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyPin | null>(null);
  return (
    <Map
      initialViewState={{
        longitude: -118.242766,
        latitude: 34.0536909,
        zoom: 10
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    >
      <NavigationControl position="top-right" />

      {properties.map((property) => (
        <Marker
          key={property.id}
          longitude={property.longitude}
          latitude={property.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedProperty(property);
          }}
        >
          <div
            style={{
              fontSize: "24px",
              cursor: "pointer",
              transform: "translateY(-50%)",
            }}
            aria-label={property.name}
            title={property.name}
          >
            📍
          </div>
        </Marker>
      ))}

      {selectedProperty && (
        <Popup
          longitude={selectedProperty.longitude}
          latitude={selectedProperty.latitude}
          anchor="top"
          onClose={() => setSelectedProperty(null)}
          closeOnClick={false}
        >
          <div style={{ minWidth: "200px" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{selectedProperty.name}</h3>
            <p style={{ margin: "0 0 4px 0" }}>
              <strong>Price:</strong> {selectedProperty.price}
            </p>
             <p style={{ margin: "0 0 4px 0" }}>
              <strong>Owner:</strong> {selectedProperty.owner}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Address:</strong> {selectedProperty.address}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}