"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import MapView from "../components/MapView";
import { GET_REONOMY_PROPERTY_BY_PARCEL } from "./graphql/queries";

type ReonomyProperty = {
  parcel_id: string | null;
  year_built: number | null;
  year_renovated: number | null;
  floors: number | null;
  sum_buildings_nbr: number | null;
  existing_floor_area_ratio: number | null;
  commercial_units: number | null;
  residential_units: number | null;
  total_units: number | null;
  building_area: number | null;
  building_class: string | null;
  asset_type: string | null;
  lot_size_sqft: number | null;
  lot_size_acres: number | null;
  zoning: string | null;
  msa_name: string | null;
  fips_county: string | null;
  municipality: string | null;
  mcd_name: string | null;
  neighborhood_name: string | null;
  legal_description: string | null;
};

type GetReonomyPropertyData = {
  reonomyProperties: {
    items: ReonomyProperty[];
  };
};

const drawerWidth = 370;

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        px: 2,
        py: 1.1,
        borderBottom: "1px solid #e5e7eb",
        alignItems: "start",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "#111827" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#374151", textAlign: "right", wordBreak: "break-word" }}
      >
        {value ?? "-"}
      </Typography>
    </Box>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: "#111827",
        }}
      >
        {title}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #d1d5db",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#ffffff",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

export default function Home() {
  const [parcelId, setParcelId] = useState<string | number | null>(null);

  const {
    data: parcelData,
    loading: parcelLoading,
    error: parcelError,
  } = useQuery<GetReonomyPropertyData>(GET_REONOMY_PROPERTY_BY_PARCEL, {
    variables: { parcelId: String(parcelId) },
    skip: !parcelId,
  });

  const d = parcelData?.reonomyProperties?.items?.[0] ?? null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Real Estate
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#f9fafb",
            borderRight: "1px solid #e5e7eb",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", height: "100%" }}>
          

          <Divider />

          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#111827" }}
            >
              Building & Lot Details
            </Typography>

            {!parcelId && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #d1d5db",
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="body2">
                  Click a parcel on the map to view details.
                </Typography>
              </Paper>
            )}

            {parcelLoading && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #d1d5db",
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="body2">
                  Loading parcel details...
                </Typography>
              </Paper>
            )}

            {parcelError && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #d1d5db",
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  Error loading parcel details: {parcelError.message}
                </Typography>
              </Paper>
            )}

            {!parcelLoading && !parcelError && parcelId && !d && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #d1d5db",
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="body2">
                  No parcel details found.
                </Typography>
              </Paper>
            )}

            {!parcelLoading && !parcelError && d && (
              <>
                <SectionCard title="Building">
                  <DetailRow label="Year Built" value={d.year_built} />
                  <DetailRow label="Year Renovated" value={d.year_renovated} />
                  <DetailRow label="Stories" value={d.floors} />
                  <DetailRow label="Number of Buildings" value={d.sum_buildings_nbr} />
                  <DetailRow
                    label="Existing Floor Area Ratio"
                    value={d.existing_floor_area_ratio}
                  />
                  <DetailRow label="Commercial Units" value={d.commercial_units} />
                  <DetailRow label="Residential Units" value={d.residential_units} />
                  <DetailRow label="Total Units" value={d.total_units} />
                  <DetailRow label="Building Area" value={d.building_area} />
                </SectionCard>

                <SectionCard title="Lot">
                  
                  <DetailRow label="Property Type" value={d.asset_type} />
                  <DetailRow label="Lot Area SF" value={d.lot_size_sqft} />
                  <DetailRow label="Lot Area Acres" value={d.lot_size_acres} />
                </SectionCard>

                <SectionCard title="Location">
                  <DetailRow label="Metropolitan Statistical Area" value={d.msa_name} />
                  <DetailRow label="County" value={d.fips_county} />
                  <DetailRow label="Municipality" value={d.municipality} />
                  <DetailRow label="Minor Civil Division" value={d.mcd_name} />
                  <DetailRow label="Neighborhood" value={d.neighborhood_name} />
                  <DetailRow label="Legal" value={d.legal_description} />
                </SectionCard>

            
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Real Estate Map
        </Typography>

        <Paper
          elevation={3}
          sx={{
            height: 650,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <MapView setParcelId={setParcelId} />
        </Paper>
      </Box>
    </Box>
  );
}