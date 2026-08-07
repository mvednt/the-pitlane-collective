import { COLLECTION_FRAGMENT, PRODUCT_FRAGMENT } from "../fragments";

/**
 * Shopify Storefront `predictiveSearch` — returns fast, typeahead-friendly
 * product and collection suggestions. Used by the live adapter's
 * `predictiveSearch`; the mock adapter searches the local dataset instead.
 */
export const PREDICTIVE_SEARCH_QUERY = /* GraphQL */ `
  query PredictiveSearch($query: String!, $limit: Int!) {
    predictiveSearch(
      query: $query
      limit: $limit
      types: [PRODUCT, COLLECTION]
    ) {
      products {
        ...ProductFragment
      }
      collections {
        ...CollectionFragment
      }
    }
  }
  ${PRODUCT_FRAGMENT}
  ${COLLECTION_FRAGMENT}
`;
