"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Command, CommandInput } from "./ui/Command";
import { Prisma, Subreddit } from "@prisma/client";

export default function SearchBar() {
  const [input, setInput] = useState<string>("");

  // we can call refetch() when needed
  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["search-query"],
    enabled: false, // we only want to fetch when we type, not when it renders
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      };
    },
  });

  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        value={input}
        onValueChange={(text) => setInput(text)}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />
    </Command>
  );
}
