import { useState, useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"
import { getFilteredProperties } from "@/services/tenantPropertyThunks.js"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PropertySearch = () => {

  const dispatch = useDispatch()

  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const searchProperties = useCallback(() => {

    if (!search && !minPrice && !maxPrice) return

    dispatch(
      getFilteredProperties({
        search,
        minPrice,
        maxPrice
      })
    )

  }, [dispatch, search, minPrice, maxPrice])

  useEffect(() => {

    const timer = setTimeout(() => {
      searchProperties()
    }, 500)

    return () => clearTimeout(timer)

  }, [searchProperties])

  useEffect(() => {

    if (!search) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {

      try {

        const res = await dispatch(
          getFilteredProperties({ search })
        ).unwrap()

        const cities = [
          ...new Set(
            res
              .map(p => p.city)
              .filter(Boolean)
          )
        ]

        setSuggestions(cities.slice(0, 5))
        setShowSuggestions(true)

      } catch {}

    }, 400)

    return () => clearTimeout(timer)

  }, [search, dispatch])

  const selectSuggestion = (value) => {
    setSearch(value)
    setShowSuggestions(false)
  }

  return (

    <div className="flex gap-3 mb-6 relative">

      <div className="relative w-full">

        <Input
          placeholder="Search city or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />

        {showSuggestions && suggestions.length > 0 && (

          <div className="absolute top-full left-0 w-full bg-white border rounded shadow z-10">

            {suggestions.map((item, index) => (

              <div
                key={index}
                onClick={() => selectSuggestion(item)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </div>

            ))}

          </div>

        )}

      </div>

      <Input
        placeholder="Min Price"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <Input
        placeholder="Max Price"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <Button onClick={searchProperties}>
        Search
      </Button>

    </div>

  )
}

export default PropertySearch