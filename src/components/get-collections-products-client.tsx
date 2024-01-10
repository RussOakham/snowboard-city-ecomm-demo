'use client'


import { useSuspenseQuery } from '@tanstack/react-query'
import { GraphQLClient } from "graphql-request"

import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT } from "@/lib/shopify/constants"
import { getProductsQuery } from "@/lib/shopify/queries/product"
import { Connection, Image, Product, ShopifyProduct, ShopifyProductsRawData } from "@/lib/shopify/types"

const domain = `https://quickstart-6cc63160.myshopify.com`
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`
const key = 'cea838c7ffb51d6219a346eb9aaa6c9e'

const ProductComponent = ({ product }: { product: Product }) => {
    return (
        <li key={product.id}>{product.title}</li>
    )
}

const client = new GraphQLClient(endpoint, {
    method: 'POST',
    fetch,
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
    },
})

interface Node { }

export const removeEdgesAndNodes = <T extends Node>(array: Connection<T>) => {
    return array.edges.map((edge) => edge?.node)
}

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
    const flattened = removeEdgesAndNodes(images)

    return flattened.map((image) => {

        const match = image.url?.match(/.*\/(.*)\..*/);
        const filename = match ? match[1] : ''

        return {
            ...image,
            altText: image.altText || `${productTitle} - ${filename}`,
        }
    })
}

const reshapeProduct = (
    product: ShopifyProduct,
    filterHiddenProducts: boolean = true,
) => {
    if (
        !product ||
        (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
    )
        return undefined

    const { images, variants, ...rest } = product

    return {
        ...rest,
        images: reshapeImages(images, product.title),
        variants: removeEdgesAndNodes(variants),
    }
}

export const reshapeProducts = (products: ShopifyProduct[]) => {
    return products.map(product => {
        if (product) {
            return reshapeProduct(product);
        }
        return null;

    }).filter(Boolean); // This will remove undefined values
}

// Get Shopify types from GraphQL codegen!
// Replace GQLClient request with server action
// User server action for initial data fetching

const useGetProductsQuery = () => {
    const { data, isLoading, isError, isSuccess } = useSuspenseQuery({
        queryKey: ['products'],
        queryFn: async () => client.request<ShopifyProductsRawData>(
            getProductsQuery
        ),
        // eslint-disable-next-line @typescript-eslint/no-shadow
        select: (data) => { return reshapeProducts(removeEdgesAndNodes(data.products)) }
    })

    return { data, isLoading, isError, isSuccess }
}

export const GetCollectionProductsClient = () => {
    const { data: products, isLoading, isError } = useGetProductsQuery()

    if (isLoading) return <p>Loading...</p>

    if (isError) return <p>Error</p>


    return (
        <div>
            <h2 className="mb-3 text-2xl font-semibold">Snowboards</h2>
            <ul>
                {products.map((product) => (
                    product ? <ProductComponent key={product.id} product={product} /> : null
                ))}
            </ul>
        </div>
    )
}