"use client"

import useQueryParams from "@/hooks/useQueryParams"
import SearchBarInput from "./SearchBarInput"

const GlobalSearchBar = () => {
  const [search, setSearch] = useQueryParams({ queryParamName: "q" })

  return (
    <SearchBarInput
      search={search}
      setSearch={setSearch}
      placeholder="Search globally"
      isLocal={false}
    />
  )
}

export default GlobalSearchBar
