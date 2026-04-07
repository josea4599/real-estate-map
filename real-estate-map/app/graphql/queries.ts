import { gql } from "@apollo/client";

export const GET_TAX_ASSESSORS = gql`
  query GetTaxAssessors {
    attomTaxAssessors {
      items {
        PropertyAddressFull
        PropertyLatitude
        PropertyLongitude
        ATTOM_ID
        parcel_id
      }
    }
  }
`;

export const GET_REONOMY_PROPERTY_BY_PARCEL = gql`
  query GetReonomyPropertyByParcel($parcelId: String!) {
    reonomyProperties(
      first: 1
      filter: { parcel_id: { eq: $parcelId } }
    ) {
      items {
        parcel_id
        year_built
        year_renovated
        floors
        building_area
        asset_type
        lot_size_sqft
        zoning
        municipality
        neighborhood_name
      }
    }
  }
`;