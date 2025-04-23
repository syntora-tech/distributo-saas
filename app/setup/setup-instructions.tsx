"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { initializeDatabase } from "@/lib/db-utils";
import SetupSteps from "./setup-steps";

export default function SetupInstructions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleSetup() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await initializeDatabase();

      if (result.success) {
        setSuccess("Database initialized successfully!");
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <SetupSteps />
    </div>
  );
}
