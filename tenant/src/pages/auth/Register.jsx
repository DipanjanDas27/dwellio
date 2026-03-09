import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { registerUser } from "@/services/authThunks.js"
import { clearAuthState } from "@/store/slices/authSlice.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.auth)

  const [file, setFile] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: "onChange"
  })

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const onSubmit = async (data) => {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, value)
    )

    if (file) formData.append("profileImage", file)

    try {
      await dispatch(registerUser(formData)).unwrap()
      dispatch(clearAuthState())
      navigate("/login")
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                {...register("full_name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Minimum 2 characters"
                  }
                })}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required"
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                {...register("phone", {
                  required: "Phone is required"
                })}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters"
                  }
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register