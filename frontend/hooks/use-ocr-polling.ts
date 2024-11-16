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

export function useOCRPolling(isEnabled: boolean, interval: number = 4000) {
  const [data, setData] = useState<OCRResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let pollTimer: NodeJS.Timeout;

    async function fetchOCRData() {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/scan-screen");
        const result: OCRResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to scan screen");
        }

        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    if (isEnabled) {
      // Initial fetch
      fetchOCRData();

      // Set up polling
      pollTimer = setInterval(fetchOCRData, interval);
    }

    // Cleanup function
    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, [isEnabled, interval]);

  return {
    data,
    error,
    isLoading,
  };
}
