import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import {
  getCurrentUser,
  updateProfile,
  updateProfileImage,
  deleteAccount
} from "@/services/userThunks.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const UpdateProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, loading } = useSelector((state) => state.user)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm({ mode: "onChange" })

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone
      })
      setPreview(user.profile_image_url)
    }
  }, [user, reset])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(selected)
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap()

      if (file) {
        const formData = new FormData()
        formData.append("profileImage", file)
        await dispatch(updateProfileImage(formData)).unwrap()
      }

      navigate("/profile")
    } catch {}
  }

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount(user.id)).unwrap()
      navigate("/login")
    } catch {}
  }

  if (!user) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-4">

      <Card>

        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="space-y-2">
            <Label>Profile Image</Label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("full_name", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register("email", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone", { required: true })} />
            </div>

            <Button
              type="submit"
              disabled={!isValid || loading}
              className="w-full"
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>

          </form>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}

export default UpdateProfile