"use client";

import { useState } from "react";
import { usePrevious } from "@mantine/hooks";
import axios, { AxiosError } from "axios";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import useCustomToast from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";

import { Button } from "./ui/Button";

interface CommentVotesProps {
  commentId: string;
  initialVotesAmount: number;
  initialVote?: Pick<CommentVote, "type">;
}

export default function CommentVotes({
  commentId,
  initialVotesAmount,
  initialVote,
}: CommentVotesProps) {
  const { loginToast } = useCustomToast();
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },
    onError: (err, VoteType) => {
      if (VoteType === "UP") setVotesAmount((prev) => prev - 1);
      else setVotesAmount((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "Your vote was not registered. Try again later",
        variant: "destructive",
      });
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmount((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === "UP")
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" aria-label="upvote">
        <ArrowBigUp
          onClick={() => vote("UP")}
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmount}
      </p>
      <Button size="sm" variant="ghost" aria-label="downvote">
        <ArrowBigDown
          onClick={() => vote("DOWN")}
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
}
