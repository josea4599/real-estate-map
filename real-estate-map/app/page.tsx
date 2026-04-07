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
  building_area: number | null;
  asset_type: string | null;
  lot_size_sqft: number | null;
  zoning: string | null;
  municipality: string | null;
  neighborhood_name: string | null;
};

type GetReonomyPropertyData = {
  reonomyProperties: {
    items: ReonomyProperty[];
  };
};

const drawerWidth = 260;

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

  const selectedParcelDetails = parcelData?.reonomyProperties?.items?.[0] ?? null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          

          <Divider />

          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Parcel Details
            </Typography>

            {!parcelId && (
              <Typography variant="body2">
                Click a parcel on the map to view details.
              </Typography>
            )}

            {parcelLoading && (
              <Typography variant="body2">
                Loading parcel details...
              </Typography>
            )}

            {parcelError && (
              <Typography variant="body2">
                Error loading parcel details.
              </Typography>
            )}

            {!parcelLoading && !parcelError && parcelId && !selectedParcelDetails && (
              <Typography variant="body2">
                No parcel details found.
              </Typography>
            )}

            {!parcelLoading && !parcelError && selectedParcelDetails && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Parcel ID:</strong> {selectedParcelDetails.parcel_id ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Year Built:</strong> {selectedParcelDetails.year_built ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Year Renovated:</strong> {selectedParcelDetails.year_renovated ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Floors:</strong> {selectedParcelDetails.floors ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Building Area:</strong> {selectedParcelDetails.building_area ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Asset Type:</strong> {selectedParcelDetails.asset_type ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Lot Size (sqft):</strong> {selectedParcelDetails.lot_size_sqft ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Zoning:</strong> {selectedParcelDetails.zoning ?? "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Municipality:</strong> {selectedParcelDetails.municipality ?? "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Neighborhood:</strong> {selectedParcelDetails.neighborhood_name ?? "N/A"}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f5f5" }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Real Estate Map
        </Typography>

        <Paper
          elevation={3}
          sx={{
            height: 550,
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