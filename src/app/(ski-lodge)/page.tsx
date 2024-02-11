import { Suspense } from "react";

import SkiLodge from "./_components.tsx/ski-lodge";

export default function IndexPage() {
 return (
    <Suspense fallback={<p>Loading Ski Lodge...</p>}>
        <SkiLodge />
    </Suspense>
 )
}