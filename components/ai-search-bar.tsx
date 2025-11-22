"use client"

import { useState } from "react"
import { Search, Calendar, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export function AISearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchCategory, setSearchCategory] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const handleSearch = () => {
    console.log("Search:", { searchQuery, searchCategory, dateFrom, dateTo })
    // Implement search logic here
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sales, clients, ledgers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={searchCategory} onValueChange={setSearchCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="clients">Clients</SelectItem>
            <SelectItem value="ledgers">Ledgers</SelectItem>
            <SelectItem value="products">Products</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              {dateFrom ? format(dateFrom, "PP") : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              {dateTo ? format(dateTo, "PP") : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} />
          </PopoverContent>
        </Popover>

        <Button size="sm" onClick={handleSearch}>
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
