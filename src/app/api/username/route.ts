import { z } from "zod";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { UsernameValidator } from "@/lib/validators/username";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorised access", { status: 401 });
    }

    const body = await req.json();

    const { name } = UsernameValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    // check is entered username is already taken
    if (username) {
      return new Response("Username already taken", { status: 409 });
    }

    // update username
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    // handle all other errors
    return new Response("Could not update username. Try again later.", {
      status: 500,
    });
  }
}
