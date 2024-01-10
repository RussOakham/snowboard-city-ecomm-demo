import { getCollectionProducts, getProducts } from "@/lib/shopify"
import { Product } from "@/lib/shopify/types"

const Product = ({ product }: { product: Product }) => {
    return (
        <li key={product.id}>{product.title}</li>
    )
}

export const GetCollectionProducts = async () => {
    // Collections that start with `hidden-*` are hidden from the search page.
    const products = await getProducts({})

    if (!products || products.length === 0) return (
        <div>
            <h2 className="mb-3 text-2xl font-semibold">Snowboards</h2>
            <p>No products found.</p>
        </div>
    )

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

