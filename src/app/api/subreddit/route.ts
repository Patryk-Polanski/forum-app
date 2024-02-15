import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
  try {
    // check is user is logged in
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorised", { status: 401 });
    }

    const body = await req.json();
    const { name } = SubredditValidator.parse(body);

    // check if subreddit with the same name already exists
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    // create subreddit
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // automatically subscribe the subreddit creator
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (error) {
    // if zod validation failed, wrong data was passed to the route
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    // handle all other errors
    return new Response("Could not create subreddit. Try agin later.", {
      status: 500,
    });
  }
}
