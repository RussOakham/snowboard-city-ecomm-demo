# Snowboard City - A Modern Headless E-Commerce Marketplace front end for Shopify stores

![Snowboard City](image.png)

Built with Next 14 App Router, Server Actions, React Query v5, ShadcnUi, TypeScript and Tailwind

[Deployed Site](https://snowboard-city-ecomm-demo.vercel.app/)
Note: Server side deployment is India, to simulate long network transfer times, highlighting power of optimistic UI.

## Features

- Built with NextJS 14, using latest features:
  - AppRouter
  - React Server Components (RSCs)
  - Server Actions
  - Server Functions
  - Route and API caching.
- React Query V5 for client-side streamed data fetching, optimistic UI updates and client/server state syncing.
- Shopify Storefront Api integration:
  - Custom Fetch server function use for all server calls
  - Custom types for all shopify objects
  - Utilizes Shopify's own checkout functionality.
- Shadcn/UI primitives for front end components
- React-Error-Boundary for handling of errors via suspense.
- t3-oss/env for type safe handling of environment variables
- react-hook-form for handling of form state
- zod for validation of user input schemas
- Axiom for logging
- Vercel for deployment, preview branches, analytics and speed insights
- Customized eslint and prettier rules for strict type safety and consistent formatting.
- 100% Written in TypeScript for End-to-End type safety

### Getting Started

---

To get started with this project, run:

```bash
git clone https://github.com/RussOakham/snowboard-city-ecomm-demo.git
```

Copy the below environment variable examples into a separate `.env` file and fill them out.

```env
NEXT_PUBLIC_COMPANY_NAME="Snowboard City"
NEXT_PUBLIC_TWITTER_CREATOR=""
NEXT_PUBLIC_TWITTER_SITE="https://nextjs.org/commerce"
NEXT_PUBLIC_SITE_NAME="Snowboard City"

NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN="[apiKey]"
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=""

SHOPIFY_REVALIDATION_SECRET=""
```

### Inspirations for the project

With the recent releases of NextJS 13 and 14, there's been a movement in the frontend community to using React Server components and the server leveraging capabilities which comes with it. RSCs, server actions and server functions allow apps to fetch data on the server instead of in the client, vastly reducing the "loading spinner hell" users can experience with some apps.

Some great examples of this new architecture have already been built and shared amongst the community, two in particular gave me inspiration to undertake this project.

Vercel release their "E-Commerce 2.0" demo, which is built entirely with native NextJS 14 functionality for RSCs, server actions and functions, Sadmann7 built a skateshop demo using the same architecture and using Shadcn/ui for its frontend componentary.

Vercel E-Commerce 2.0:
[E-Commerce 2.0 - Demo](https://demo.vercel.store/)
[E-Commerce 2.0 - Repo](https://github.com/vercel/commerce)

Skateshop:

[Skateshop - Demo](https://skateshop.sadmn.com/)
[Skateshop - Repo](https://github.com/sadmann7/skateshop)

Both show the power of server-side fetching to ensure fast immediate load speeds, aggressive caching, so once a required `GET` call has been made, subsequent use of that data is served immediately from the cache (eliminating repeated loading spinners) and the reduction in code complexity due to the new framework abstractions.

While I loved these approaches, I felt one area could be improved, mutations. Any data which needs an stale-time time of 0, cannot be served from a cache, so must be served fresh from the server each time. Causing a slow laggy feel to the UX while data makes it round trip journey to the server, database and back.
In the above projects, the main place you can see this in when updating the cart.

[Vercel E-Commerce 2.0 Cart](./src/assets/videos/vercel-ecommerce-cart.mov)

While this can be reduced by ensuring your server is a close to the client as possible (CDN distributed edge runtimes), its always going to be an issue for customers, especially for those on slow connections (3G / 4G countryside etc.).

So how to counter this? Optimistic updates.

React Query, which provides a great API for building optimistic data handling. They also recently released an experimental feature to allow its use with server actions, via streamed data fetching. So I decided to build this project to clone the vercel e-commerce 2.0 approach, but improve on it via adding optimistic UI via React Query.

[Snowboard City Cart](./src/assets//videos/snowboard-city-cart.mov)

In the above example the UI of the in-basket cost is updated immediately upon click, showing instant feedback to the user (Buttons are still disabled until the network response resolves, to avoid any race condition).
Note: This I've situated the server for the deployed demo in India (client in UK), to simulate long network data transfer times.

By using streamed data via React Query, we ensure initial GET calls are made on the server via server functions, ensuring quick initial page loads, while subsequent network calls are managed via React Query and its caching system.

### Using Server Actions in React Query

[React Query Docs - Experimental streaming without prefetching in Next.js](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#experimental-streaming-without-prefetching-in-nextjs)

Converting a server function to React Query via `useSuspenseQuery` hook:

To obtain optimistic user interfaces, you need to manually augment the cached data React Query holds to mimic the how a successful response would resolve. You can see an example of how this is managed in the below code:

[AddItemToCartMutation](./src/lib/react-query/mutations/useAddItemMutation.tsx)

```ts
export const useAddItemMutation = () => {
 const queryClient = useQueryClient()

 return useMutation({
  // Call server function which creates cart if it doesn't exist and adds item to cart
  mutationFn: ({
   prevState,
   selectedVariantId,
  }: {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   prevState: any
   selectedVariantId: string | undefined
   product: Product
   cartId: string | undefined
  }) => addItem(prevState, selectedVariantId),

  // Augment caches to mimic onSuccess scenario, to provide optimistic UX.
  // If no existing cart (cartid is undefined), create a new cart with the selected variant.
  onMutate: async ({
   selectedVariantId,
   product,
   cartId,
  }: {
   selectedVariantId: string | undefined
   product: Product
   cartId: string | undefined
  }) => {
   const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
   )

   if (!selectedVariant || !selectedVariantId) {
    throw new Error('Missing product variant ID')
   }

   if (!product) {
    throw new Error('Missing product information')
   }

   // Cancel any outgoing cart queries
   await queryClient.cancelQueries({ queryKey: ['cart', cartId] })

   // Get previous Cart state and if no previous cart, set to mocked empty cart state
   const previousCart = queryClient.getQueryData<Cart>(['cart', cartId])

   const cart: Cart = previousCart ?? emptyCart

   // Create optimistic cart, mimicking how cart would look in happy path scenario
   const optimisticCart: Cart = {
    ...cart,
    lines: [
     ...cart.lines,
     {
      id: 'temp-id',
      quantity: 1,
      cost: {
       totalAmount: {
        amount: selectedVariant.price.amount,
        currencyCode: selectedVariant.price.currencyCode,
       },
      },
      merchandise: {
       id: selectedVariant.id,
       title: product.title,
       selectedOptions: selectedVariant.selectedOptions,
       product,
      },
     },
    ],
    cost: {
     ...cart.cost,
     subtotalAmount: {
      amount: (
       Number(cart.cost.subtotalAmount.amount) +
       Number(selectedVariant.price.amount)
      ).toString(),
      currencyCode: selectedVariant.price.currencyCode,
     },
     totalAmount: {
      amount: (
       Number(cart.cost.totalAmount.amount) +
       Number(selectedVariant.price.amount)
      ).toString(),
      currencyCode: selectedVariant.price.currencyCode,
     },
     totalTaxAmount: {
      amount: (
       Number(cart.cost.totalTaxAmount.amount) +
       Number(selectedVariant.price.amount) * 0.1
      ).toString(),
      currencyCode: cart.cost.totalTaxAmount.currencyCode,
     },
    },
    totalQuantity: cart.totalQuantity + 1,
   }

   // Set cart to optimistic state
   queryClient.setQueryData<Cart>(['cart', cartId], optimisticCart)

   // return previous, un-augmented, cart state, to allow its use in onError function
   return { previousCart }
  },
  onError: (err, variables, context) => {
   // if error happens in mutation 'cart' cache is reset to previous state
   if (context?.previousCart) {
    queryClient.setQueryData(
     ['cart', variables.cartId],
     context.previousCart,
    )
   }
  },
  onSuccess: (data) => {
   // Shopify request always returns 200, so need to manually check and throw errors
   if (data === 'Missing product variant ID') {
    throw new Error('Missing product variant ID')
   }

   if (data === 'Error adding item to cart') {
    throw new Error('Error adding item to cart')
   }

   return data
  },
  onSettled: async (data, error, variables) => {
   // Always invalidate cache after error or success, to trigger refetch of fresh data
   await queryClient.invalidateQueries({
    queryKey: ['cart', variables.cartId],
   })
  },
 })
}
```
