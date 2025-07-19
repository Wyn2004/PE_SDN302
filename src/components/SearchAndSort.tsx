"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchAndSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const sort = searchParams.get("sort") || "asc";

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  }, 300);

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const handleSortToggle = () => {
    const params = new URLSearchParams(searchParams);
    const newSort = sort === "asc" ? "desc" : "asc";
    params.set("sort", newSort);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search posts by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button variant="outline" onClick={handleSortToggle}>
        <ArrowUpDown className="w-4 h-4 mr-2" />
        Sort {sort === "asc" ? "A-Z" : "Z-A"}
      </Button>
    </div>
  );
}
