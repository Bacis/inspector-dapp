import { useState, useEffect } from "react";

// New type for predictions array
type Prediction = [string, number]; // [text, confidence]

interface OCRResponse {
  success: boolean;
  data: {
    predictions: Prediction[];
  };
  error?: string;
}

// Updated result type to match what we'll provide to components
interface OCRResult {
  text: string;
  confidence: number;
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

          // Transform predictions array into OCRResult array
          const transformedData: OCRResult[] = result.data.predictions.map(
            ([text, confidence]) => ({
              text,
              confidence,
            })
          );

          // Filter out any predictions with confidence less than 0.8
          const filteredData = transformedData.filter(
            (result) => result.confidence >= 0.8
          );

          setData(filteredData);
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
