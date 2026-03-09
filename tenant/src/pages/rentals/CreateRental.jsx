import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useParams, useNavigate, useLocation } from "react-router-dom"

import { createRental, renewRental } from "@/services/tenantRentalThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const CreateRental = () => {

  const { propertyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isRenew = location.state?.isRenew
  const rentalId = location.state?.rentalId

  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm({ mode: "onChange" })

  const onSubmit = async (data) => {

    if (isRenew) {

      const renewData = {
        start_date: data.start_date,
        end_date: data.end_date,
        idempotency_key: crypto.randomUUID(),
        paymentMode: "auto"
      }

      await dispatch(
        renewRental({
          rentalId,
          data: renewData
        })
      )

    } else {

      const formData = new FormData()

      formData.append("start_date", data.start_date)
      formData.append("end_date", data.end_date)
      formData.append("notice_period", data.notice_period)
      formData.append("monthly_rent", data.monthly_rent)
      formData.append("paymentMode", "auto")

      formData.append(
        "idempotency_key",
        crypto.randomUUID()
      )

      if (data.agreement) {
        formData.append("agreement", data.agreement[0])
      }

      await dispatch(
        createRental({
          propertyId,
          formData
        })
      )
    }

    navigate("/rentals")
  }

  return (
    <div className="max-w-xl mx-auto p-4">

      <Card>

        <CardHeader>
          <CardTitle>
            {isRenew ? "Renew Rental" : "Create Rental"}
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                {...register("start_date", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                {...register("end_date", { required: true })}
              />
            </div>

            {!isRenew && (
              <>
                <div className="space-y-2">
                  <Label>Notice Period</Label>
                  <Input
                    type="number"
                    {...register("notice_period")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Monthly Rent</Label>
                  <Input
                    type="number"
                    {...register("monthly_rent", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Agreement Document</Label>
                  <Input
                    type="file"
                    {...register("agreement")}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full"
            >
              {isRenew ? "Renew Rental" : "Create Rental"}
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

export default CreateRental