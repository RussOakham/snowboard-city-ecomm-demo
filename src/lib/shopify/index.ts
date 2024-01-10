import { revalidateTag } from "next/cache";
import { headers as nextHeaders } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCollectionProductsQuery } from "./queries/collection";
import { getProductsQuery } from "./queries/product";
import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "./constants";
import {
  Connection,
  Image,
  Product,
  ShopifyCollectionProductsOperation,
  ShopifyProduct,
  ShopifyProductsOperation,
} from "./types";

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query?: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
}): Promise<{ status: number; body: T } | never> {
  const result = await fetch(endpoint, {
    method: "POST",
    headers: {
      XMLHttpRequest: "XMLHttpRequest",
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": key,
      ...headers,
    },
    body: JSON.stringify({
      ...(query && { query }),
      ...(variables && { variables }),
    }),
    cache,
    ...(tags && { next: { tags } }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await result.json();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (body.errors) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw body.errors[0];
  }

  return {
    status: result.status,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body,
  };
}

export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const match = image.url.match(/.*\/(.*)\..*/);
    const filename = match ? match[1] : "default";
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  )
    return undefined;

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

export const reshapeProducts = (products: ShopifyProduct[]) => {
  return products
    .filter((product): product is ShopifyProduct => product !== undefined)
    .map((product) => reshapeProduct(product))
    .filter((product): product is Product => product !== undefined);
};

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    // eslint-disable-next-line no-console
    console.log(`No collection found for "${collection}"`);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products),
  );
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionsWebhooks = [
    "collections/create",
    "collections/update",
    "collections/delete",
  ];
  const productWebhooks = [
    "products/create",
    "products/update",
    "products/delete",
  ];
  const topic = nextHeaders().get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionsWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    // eslint-disable-next-line no-console
    console.error("Invalid revalidation secret");
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  // We need to revalidate all products if a collection is updated.
  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  // We need to revalidate a specific product if a product is updated.
  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidate: true, now: Date.now() });
}
