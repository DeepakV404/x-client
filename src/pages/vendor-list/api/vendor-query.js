import { gql } from "@apollo/client";

export const VENDORS = gql`
    query Vendors{
        vendors{
            companyName
            logoUrl
            tenantName
            industryType
            websiteUrl
            twitterUrl
            linkedInUrl
          }
    }
`;