import { useState, useEffect } from "react";

interface OCRResult {
  text: string;
  coordinates: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  confidence: number;
}

interface OCRResponse {
  success: boolean;
  data: OCRResult[];
  error?: string;
}

export function useOCRPolling(isEnabled: boolean) {
  const [data, setData] = useState<OCRResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    async function pollOCRData() {
      while (isSubscribed) {
        try {
          setIsLoading(true);
          const response = await fetch("http://127.0.0.1:5001/api/scan-screen");
          const result: OCRResponse = await response.json();

          if (!isSubscribed) break;

          if (!result.success) {
            throw new Error(result.error || "Failed to scan screen");
          }

          setData(result.data);
          setError(null);
        } catch (err) {
          if (!isSubscribed) break;
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (isEnabled) {
      pollOCRData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [isEnabled]);

  return { data, error, isLoading };
}
