import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import MiniCreatePost from "@/components/MiniCreatePost";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function SubredditPage({ params }: PageProps) {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },

        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  // throw 404 if there is no data
  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      {/* TODO: show posts in user feed */}
    </>
  );
}
