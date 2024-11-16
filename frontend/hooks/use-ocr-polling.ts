import { useState, useEffect } from "react";

// New type for predictions array
type Prediction = [string, number]; // [text, confidence]

interface OCRResponse {
  success: boolean;
  data: {
    predictions: Prediction[];
  };
  error?: string;
  screenshot: string; // base64 encoded string
}

// Updated result type to match what we'll provide to components
interface OCRResult {
  text: string;
  confidence: number;
}

interface ResultWithImage {
  suspicious: boolean;
  screenshot: string;
}

export function useOCRPolling(isEnabled: boolean) {
  const [data, setData] = useState<ResultWithImage>({
    suspicious: false,
    screenshot: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    async function pollOCRData() {
      while (isSubscribed) {
        console.log("polling for OCR data");
        try {
          setIsLoading(true);
          console.log("fetching OCR data");
          const response = await fetch("http://127.0.0.1:5001/api/scan-screen");
          console.log("response is ", response);
          const result: OCRResponse = await response.json();
          console.log("isSubscribed is ", isSubscribed);
          if (!isSubscribed) break;

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

          // Create data URL for the screenshot
          const decodedScreenshot = `data:image/png;base64,${result.screenshot}`;

          console.log("decodedScreenshot is ", decodedScreenshot);
          setData({
            suspicious: filteredData.length > 0,
            screenshot: decodedScreenshot,
          });

          setError(null);
        } catch (err) {
          if (!isSubscribed) break;
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }

        // Add delay between polls
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 5 second delay
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
