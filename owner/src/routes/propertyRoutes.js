import { lazy } from "react"
import AuthLayout from "@/components/custom/AuthLayout"

const OwnerProperties = lazy(() => import("@/pages/properties/OwnerProperties"))
const CreateProperty = lazy(() => import("@/pages/properties/CreateProperty"))
const EditProperty = lazy(() => import("@/pages/properties/EditProperty"))

const propertyRoutes = [
  {
    path: "/owner/properties",
    element: (
      <AuthLayout authentication={true}>
        <OwnerProperties />
      </AuthLayout>
    )
  },
  {
    path: "/owner/properties/:propertyId",
    element: (
      <AuthLayout authentication={true}>
        <PropertyDetails />
      </AuthLayout>
    )
  },
  {
    path: "/owner/properties/create",
    element: (
      <AuthLayout authentication={true}>
        <CreateProperty />
      </AuthLayout>
    )
  },
  {
    path: "/owner/properties/:propertyId/edit",
    element: (
      <AuthLayout authentication={true}>
        <EditProperty />
      </AuthLayout>
    )
  }
]

export default propertyRoutes