"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { User } from "@prisma/client";

interface UserNameFormProps {
  user: Pick<User, "id" | "username">;
}

export default function UserNameForm({ user }: UserNameFormProps) {
  const {} = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  return <form onSubmit={() => {}}></form>;
}
