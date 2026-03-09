import { useState } from "react"
import { useDispatch } from "react-redux"
import { getFilteredProperties } from "@/services/tenantPropertyThunks.js"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const PropertySearch = () => {
  const dispatch = useDispatch()

  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: ""
  })

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleSearch = () => {
    if (!filters.city || !filters.minPrice || !filters.maxPrice) return
    dispatch(getFilteredProperties(filters))
  }

  return (
    <div className="grid md:grid-cols-4 gap-4">

      <div className="space-y-1">
        <Label>City</Label>
        <Input
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Enter city"
        />
      </div>

      <div className="space-y-1">
        <Label>Min Price</Label>
        <Input
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1">
        <Label>Max Price</Label>
        <Input
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      <Button
        className="mt-6"
        onClick={handleSearch}
      >
        Search
      </Button>

    </div>
  )
}

export default PropertySearch