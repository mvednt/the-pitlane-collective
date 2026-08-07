export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

export const SEO_FRAGMENT = /* GraphQL */ `
  fragment SeoFragment on SEO {
    title
    description
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = /* GraphQL */ `
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    sku
    selectedOptions {
      name
      value
    }
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    image {
      ...ImageFragment
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    vendor
    tags
    availableForSale
    updatedAt
    featuredImage {
      ...ImageFragment
    }
    images(first: 8) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    variants(first: 100) {
      edges {
        node {
          ...ProductVariantFragment
        }
      }
    }
    seo {
      ...SeoFragment
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${SEO_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

export const COLLECTION_FRAGMENT = /* GraphQL */ `
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    updatedAt
    image {
      ...ImageFragment
    }
    seo {
      ...SeoFragment
    }
  }
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFragment
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              quantityAvailable
              selectedOptions {
                name
                value
              }
              image {
                ...ImageFragment
              }
              product {
                id
                handle
                title
              }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;
