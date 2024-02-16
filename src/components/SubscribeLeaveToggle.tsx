"use client";

import { Button } from "./ui/Button";

export default function SubscribeLeaveToggle() {
  const isSubscribed = false;
  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">Join community</Button>
  );
}
