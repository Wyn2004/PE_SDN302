"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Search, ArrowUpDown, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchAndSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [groups, setGroups] = useState<string[]>([]);
  const sort = searchParams.get("sort") || "asc";
  const selectedGroup = searchParams.get("group") || "";

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

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/users/groups");
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleSortToggle = () => {
    const params = new URLSearchParams(searchParams);
    const newSort = sort === "asc" ? "desc" : "asc";
    params.set("sort", newSort);
    router.push(`/?${params.toString()}`);
  };

  const handleGroupChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("group", value);
    } else {
      params.delete("group");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search users by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2 min-w-[200px]">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={selectedGroup} onChange={(e) => handleGroupChange(e.target.value)}>
          <option value="">All Groups</option>
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </Select>
      </div>

      <Button variant="outline" onClick={handleSortToggle}>
        <ArrowUpDown className="w-4 h-4 mr-2" />
        Sort {sort === "asc" ? "A-Z" : "Z-A"}
      </Button>
    </div>
  );
}
