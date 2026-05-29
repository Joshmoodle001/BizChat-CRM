"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleLogout() {
    setLoading(true);
    router.push("/logout");
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} loading={loading}>
      Log out
    </Button>
  );
}
