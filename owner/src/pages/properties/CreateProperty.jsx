import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { ownerCreateProperty } from "@/services/ownerPropertyThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const CreateProperty = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.property)

  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm({ mode: "onChange" })

  const onSubmit = async (data) => {

    try {

      const formData = new FormData()

      Object.keys(data).forEach((key) => {

        if (key === "image") {
          if (data.image?.[0]) {
            formData.append("image", data.image[0])
          }
        } else {
          formData.append(key, data[key])
        }

      })

      await dispatch(
        ownerCreateProperty(formData)
      ).unwrap()

      navigate("/owner/properties")

    } catch { }
  }

  return (
    <div className="max-w-xl mx-auto p-4">

      <Card>

        <CardHeader>
          <CardTitle>Create Property</CardTitle>
        </CardHeader>

        <CardContent>

          {error && (
            <p className="text-sm text-red-500 mb-4">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
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
              <Input
                type="number"
                {...register("rent_amount", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Security Deposit</Label>
              <Input
                type="number"
                {...register("security_deposit")}
              />
            </div>

            <div className="space-y-2">
              <Label>Total Rooms</Label>
              <Input
                type="number"
                {...register("total_rooms")}
              />
            </div>

            <div className="space-y-2">
              <Label>Available Rooms</Label>
              <Input
                type="number"
                {...register("available_rooms")}
              />
            </div>

            <div className="space-y-2">
              <Label>Property Image</Label>
              <Input
                type="file"
                {...register("image", { required: true })}
              />
            </div>

            <Button
              type="submit"
              disabled={!isValid || loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Property"}
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

export default CreateProperty