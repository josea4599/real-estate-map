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