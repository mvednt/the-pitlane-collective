import { PRODUCT_FRAGMENT } from "../fragments";

export const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts(
    $first: Int!
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(
      first: $first
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_ID_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductIdByHandle($handle: String!) {
    product(handle: $handle) {
      id
    }
  }
`;

export const GET_PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;
