'use client'


import { Connection, Image, Product, ShopifyProduct, ShopifyProductsOperation, ShopifyProductsRawData } from "@/lib/shopify/types"
import { useSuspenseQuery } from '@tanstack/react-query'

import { getProductsQuery } from "@/lib/shopify/queries/product"
import { request, GraphQLClient } from "graphql-request"
import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT } from "@/lib/shopify/constants"

const domain = `https://quickstart-6cc63160.myshopify.com`
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`
const key = 'cea838c7ffb51d6219a346eb9aaa6c9e'

const Product = ({ product }: { product: Product }) => {
    return (
        <li key={product.id}>{product.title}</li>
    )
}

const client = new GraphQLClient(endpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
    },
})

export const removeEdgesAndNodes = (array: Connection<any>) => {
    return array.edges.map((edge) => edge?.node)
}

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
    const flattened = removeEdgesAndNodes(images)

    return flattened.map((image) => {
        const filename = image.url.match(/.*\/(.*)\..*/)[1]
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
    const reshapedProducts = []

    for (const product of products) {
        if (product) {
            const reshapedProduct = reshapeProduct(product)

            if (reshapedProduct) {
                reshapedProducts.push(reshapedProduct)
            }
        }
    }

    return reshapedProducts
}

// Get Shopify types from GraphQL codegen!
// Replace GQLClient request with server action
// User server action for initial data fetching

const useGetProductsQuery = () => {
    const { data, isLoading, isError } = useSuspenseQuery({
        queryKey: ['products'],
        queryFn: async () => client.request<ShopifyProductsRawData>(
            getProductsQuery
        ),
        select: (data) => { return reshapeProducts(removeEdgesAndNodes(data.products)) }
    })

    return { data, isLoading, isError }
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
                    <Product key={product.id} product={product} />
                ))}
            </ul>
        </div>
    )
}