"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import Map, { Layer, Marker, NavigationControl, Popup, Source } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { LayerProps } from "react-map-gl/mapbox";
import type { MapLayerMouseEvent } from "mapbox-gl";
import { GET_TAX_ASSESSORS } from "../app/graphql/queries";

type TaxAssessorItem = {
  PropertyAddressFull: string | null;
  PropertyLatitude: number | string | null;
  PropertyLongitude: number | string | null;
  ATTOM_ID: string | number | null;
  parcel_id: string | null;
};

type GetTaxAssessorsData = {
  attomTaxAssessors: {
    items: TaxAssessorItem[];
  };
};

const PARCEL_FILL_LAYER_ID = "parcel-fill-layer";
const PARCEL_LINE_LAYER_ID = "parcel-line-layer";

export default function MapView({
  setParcelId,
}: {
  setParcelId: (id: string | number | null) => void;
}) {
  const [selectedProperty, setSelectedProperty] = useState<TaxAssessorItem | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string | number | null>(null);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | number | null>(null);

  const { loading, error, data } = useQuery<GetTaxAssessorsData>(GET_TAX_ASSESSORS);

  const properties: TaxAssessorItem[] = useMemo(() => {
    const items = data?.attomTaxAssessors?.items ?? [];

    return items.filter((item: TaxAssessorItem) => {
      const lat = Number(item.PropertyLatitude);
      const lng = Number(item.PropertyLongitude);
      return !Number.isNaN(lat) && !Number.isNaN(lng);
    });
  }, [data]);

  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading map data...</div>;
  }

  if (error) {
    return <div style={{ padding: "1rem" }}>Error loading map data.</div>;
  }

  const handleParcelClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const clickedId = feature.properties?.ID;
    console.log("Clicked parcel ID:", clickedId);

    if (clickedId !== undefined && clickedId !== null) {
      setSelectedParcelId(clickedId);
      setParcelId(clickedId);
    }
  };

  const handleParcelHover = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) {
      setHoveredParcelId(null);
      return;
    }

    const hoverId = feature.properties?.ID;
    setHoveredParcelId(hoverId ?? null);
  };

  const parcelFillLayer: LayerProps = {
    id: PARCEL_FILL_LAYER_ID,
    type: "fill",
    "source-layer": "attom-parcels",
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "ID"], selectedParcelId ?? ""],
        "#ff9800",
        ["==", ["get", "ID"], hoveredParcelId ?? ""],
        "#42a5f5",
        "#0080ff",
      ],
      "fill-opacity": [
        "case",
        ["==", ["get", "ID"], selectedParcelId ?? ""],
        0.5,
        ["==", ["get", "ID"], hoveredParcelId ?? ""],
        0.35,
        0.15,
      ],
    },
  };

  const parcelLineLayer: LayerProps = {
    id: PARCEL_LINE_LAYER_ID,
    type: "line",
    "source-layer": "attom-parcels",
    paint: {
      "line-color": [
        "case",
        ["==", ["get", "ID"], selectedParcelId ?? ""],
        "#e65100",
        ["==", ["get", "ID"], hoveredParcelId ?? ""],
        "#1565c0",
        "#333333",
      ],
      "line-width": [
        "case",
        ["==", ["get", "ID"], selectedParcelId ?? ""],
        3,
        ["==", ["get", "ID"], hoveredParcelId ?? ""],
        2,
        1,
      ],
    },
  };

  return (
    <Map
      initialViewState={{
        longitude: -74.00594,
        latitude: 40.71278,
        zoom: 10,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      interactiveLayerIds={[PARCEL_FILL_LAYER_ID, PARCEL_LINE_LAYER_ID]}
      onClick={handleParcelClick}
      onMouseMove={handleParcelHover}
      onMouseLeave={() => setHoveredParcelId(null)}
      cursor={hoveredParcelId ? "pointer" : "default"}
    >
      <NavigationControl position="top-right" />

      <Source id="parcels-source" type="vector" url="mapbox://svayser.parcel-boundaries">
        <Layer {...parcelFillLayer} />
        <Layer {...parcelLineLayer} />
      </Source>
      
    </Map>
  );
}