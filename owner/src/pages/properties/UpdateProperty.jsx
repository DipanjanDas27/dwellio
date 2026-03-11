import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import { getProperty } from "@/services/propertyThunks.js"
import {
  ownerUpdateProperty,
  ownerUpdatePropertyImage
} from "@/services/ownerPropertyThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const UpdateProperty = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { propertyId } = useParams()

  const { property, loading, error } = useSelector((state) => state.property)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm({ mode: "onChange" })

  useEffect(() => {
    dispatch(getProperty(propertyId))
  }, [dispatch, propertyId])

  useEffect(() => {
    if (property) {

      reset({
        title: property.title,
        description: property.description,
        property_type: property.property_type,
        bhk: property.bhk,
        furnishing: property.furnishing,
        address: property.address,
        city: property.city,
        state: property.state,
        pincode: property.pincode,
        rent_amount: property.rent_amount,
        security_deposit: property.security_deposit,
        total_rooms: property.total_rooms,
        available_rooms: property.available_rooms
      })

      setPreview(property.image_url)
    }
  }, [property, reset])

  const handleFileChange = (e) => {

    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(selected)
  }

  const updateDetails = async (data) => {

    try {

      await dispatch(
        ownerUpdateProperty({
          propertyId,
          data
        })
      ).unwrap()

      navigate(`/owner/properties/${propertyId}`)

    } catch { }
  }

  const updateImage = async () => {

    if (!file) return

    try {

      const formData = new FormData()
      formData.append("image", file)

      await dispatch(
        ownerUpdatePropertyImage({
          propertyId,
          formData
        })
      ).unwrap()

      navigate(`/owner/properties/${propertyId}`)

    } catch { }
  }

  if (!property) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-4">

      <Card>

        <CardHeader>
          <CardTitle>Update Property</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="space-y-2">

            <Label>Property Image</Label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover rounded-md"
              />
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              onClick={updateImage}
              disabled={!file}
              className="w-full"
            >
              Update Image
            </Button>

          </div>

          <form
            onSubmit={handleSubmit(updateDetails)}
            className="space-y-4"
          >

            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register("title", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} />
            </div>

            <div className="space-y-2">
              <Label>Property Type</Label>
              <Input {...register("property_type", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>BHK</Label>
              <Input type="number" {...register("bhk")} />
            </div>

            <div className="space-y-2">
              <Label>Furnishing</Label>
              <Input {...register("furnishing")} />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input {...register("address", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Input {...register("city", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <Input {...register("state", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input {...register("pincode")} />
            </div>

            <div className="space-y-2">
              <Label>Rent Amount</Label>
              <Input type="number" {...register("rent_amount", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Security Deposit</Label>
              <Input type="number" {...register("security_deposit")} />
            </div>

            <div className="space-y-2">
              <Label>Total Rooms</Label>
              <Input type="number" {...register("total_rooms")} />
            </div>

            <div className="space-y-2">
              <Label>Available Rooms</Label>
              <Input type="number" {...register("available_rooms")} />
            </div>

            <Button
              type="submit"
              disabled={!isValid || loading}
              className="w-full"
            >
              {loading ? "Updating..." : "Update Property"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}

export default UpdateProperty