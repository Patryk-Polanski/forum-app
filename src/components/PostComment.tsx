"use client";

import { useRef } from "react";

import { ExtendedComment } from "@/types/db";
import { formatTimeToNow } from "@/lib/utils";

import UserAvatar from "./UserAvatar";

interface PostCommentProps {
  comment: ExtendedComment;
}

export default function PostComment({ comment }: PostCommentProps) {
  const commentRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <time className="max-h-40 trunacte text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </time>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
    </div>
  );
}
