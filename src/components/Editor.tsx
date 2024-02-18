"use client";

import { useForm } from "react-hook-form";
import TextAreaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";

import { PostCreationRequest, PostValidator } from "@/lib/validators/post";

interface EditorProps {
  subredditId: string;
}

export default function Editor({ subredditId }: EditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form id="subreddit-post-form" className="w-fit" onSubmit={() => {}}>
        <div className="prose prose-stone dark:prose-invert">
          <TextAreaAutosize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
}
