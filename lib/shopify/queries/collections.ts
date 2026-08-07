import { COLLECTION_FRAGMENT, PRODUCT_FRAGMENT } from "../fragments";

export const GET_COLLECTIONS_QUERY = /* GraphQL */ `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...CollectionFragment
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetCollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      ...CollectionFragment
    }
  }
  ${COLLECTION_FRAGMENT}
`;

export const GET_COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collectionByHandle(handle: $handle) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
