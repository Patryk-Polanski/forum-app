import { db } from "@/lib/db";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subredditId, title, content } = PostValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorised access", { status: 401 });
    }

    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return new Response("You need to subscribe to subreddit to make posts.", {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    // handle all other errors
    return new Response(
      "Could not post to subreddit at this time. Try again later.",
      {
        status: 500,
      }
    );
  }
}
