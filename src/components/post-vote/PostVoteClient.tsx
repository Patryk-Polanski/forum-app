"use client";

import { useEffect, useState } from "react";
import useCustomToast from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import axios from "axios";
import { type VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { PostVoteRequest } from "@/lib/validators/vote";

import { Button } from "../ui/Button";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmount: number;
  initialVote?: VoteType | null;
}

export default function PostVoteClient({
  postId,
  initialVotesAmount,
  initialVote,
}: PostVoteClientProps) {
  const { loginToast } = useCustomToast();
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    // sometimes initially current vote might be undefined, so re-run the code below when initialVote changes
    setCurrentVote(initialVote);
  }, [initialVote]);

  const {} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch("/api/subreddit/post/vote", payload);
    },
  });

  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button size="sm" variant="ghost" aria-label="upvote">
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmount}
      </p>
      <Button size="sm" variant="ghost" aria-label="downvote">
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
}
