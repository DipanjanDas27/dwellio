import { useEffect, useMemo, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "motion/react"
import { Building2, SearchX } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { getFilteredProperties } from "@/services/tenantPropertyThunks.js"
import PropertySearch from "@/components/custom/PropertySearch"
import PropertyCard from "@/components/custom/PropertyCard"

const DEFAULT_FILTER = { minPrice: 0, maxPrice: 1000000 }

const Properties = () => {
  const dispatch = useDispatch()
  const { properties, loading } = useSelector((state) => state.property)

  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    dispatch(getFilteredProperties(DEFAULT_FILTER))
  }, [dispatch])

  const handleSearch = useCallback(() => {
    if (!search && !minPrice && !maxPrice) return
    setHasSearched(true)
    dispatch(getFilteredProperties({ search, minPrice, maxPrice }))
  }, [dispatch, search, minPrice, maxPrice])

  const handleReset = useCallback(() => {
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    setHasSearched(false)
    dispatch(getFilteredProperties(DEFAULT_FILTER))
  }, [dispatch])

  const propertyList = useMemo(() => properties || [], [properties])

  if (loading) return (
    <div className="min-h-screen bg-cream-bg font-montserrat">
      <div className="bg-beige-card/50 border-b px-4 sm:px-6 lg:px-page py-6 sm:py-8">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-40 mb-6" />
        <Skeleton className="w-full h-32 sm:h-24" />
      </div>

      <div className="px-4 sm:px-6 lg:px-page py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-card shadow-card overflow-hidden">
            <Skeleton className="w-full h-48 sm:h-55" />
            <div className="p-4 sm:p-5 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-bg font-montserrat">

      {/* Header */}
      <div className="bg-beige-card/50 border-b px-4 sm:px-6 lg:px-page py-6 sm:py-8">
        <motion.div className="flex items-center gap-3 mb-6">

          <div className="size-10 sm:size-11 bg-white flex items-center justify-center shadow-card">
            <Building2 size={18} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold truncate">Properties</h1>
            <p className="text-xs sm:text-sm text-brown-muted">
              {propertyList.length > 0
                ? `${propertyList.length} properties found`
                : hasSearched
                  ? "No results"
                  : "Browse rentals"}
            </p>
          </div>
        </motion.div>

        <PropertySearch
          search={search}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onSearchChange={setSearch}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      {/* List */}
      <div className="px-4 sm:px-6 lg:px-page py-8">

        {propertyList.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="size-14 bg-beige-card flex items-center justify-center mb-4">
              <SearchX size={24} />
            </div>
            <p className="text-base font-bold mb-1">
              {hasSearched ? "No properties found" : "No properties available"}
            </p>
            <p className="text-sm text-brown-muted">
              Try adjusting filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {propertyList.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Properties