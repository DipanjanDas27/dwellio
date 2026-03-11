import { lazy } from "react"

const Properties = lazy(() => import("@/pages/properties/Properties"))
const PropertyDetails = lazy(() => import("@/pages/properties/PropertyDetails"))

const propertyRoutes = [
  {
    path: "/properties",
    element: <Properties />
  },
  {
    path: "/properties/:propertyId",
    element: <PropertyDetails />
  }
]

export default propertyRoutes