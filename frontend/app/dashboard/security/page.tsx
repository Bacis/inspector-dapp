"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function PrivacyPage() {
  const [tdxquote, setTdxquote] = useState("");
  const [deriveKey, setDeriveKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "omit" as RequestCredentials,
    };
    Promise.all([
      fetch("http://localhost:3000/tdxquote")
        .then((res) => res.json())
        .then((data) => setTdxquote(data.tdxQuote)),
      fetch("http://localhost:3000/derivekey")
        .then((res) => res.json())
        .then((data) => setDeriveKey(data.deriveKey)),
    ]).finally(() => setIsLoading(false));
  }, []);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Security Proofs</h1>
      <p className="text-muted-foreground">
        Verify the proofs of LLM classifications over TEE here (Phala Network).
      </p>

      <h3 className="text-lg font-bold mt-4">TDX Quote</h3>
      <div className="w-[800px] h-[80px] bg-muted rounded-3xl mt-4 flex items-center justify-start px-6">
        <Button
          variant="default"
          className="size-9"
          onClick={() => copyToClipboard(tdxquote)}
        >
          <Copy />
        </Button>
        <Input
          value={isLoading ? "Loading..." : tdxquote}
          readOnly
          className="w-full border-none mx-4 bg-transparent"
        />
      </div>
      <h3 className="text-lg font-bold mt-4">Derive Key</h3>
      <div className="w-[800px] h-[80px] bg-muted rounded-3xl mt-4 flex items-center justify-start px-6">
        <Button
          variant="default"
          className="size-9"
          onClick={() => copyToClipboard(deriveKey)}
        >
          <Copy />
        </Button>
        <Input
          value={isLoading ? "Loading..." : deriveKey}
          readOnly
          className="w-full border-none mx-4 bg-transparent"
        />
      </div>
    </div>
  );
}
