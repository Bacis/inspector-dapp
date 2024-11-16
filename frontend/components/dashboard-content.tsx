import { Card } from "./ui/card";

interface OCRResult {
  predictions: [string, number][];
}

interface DashboardContentProps {
  ocrData?: OCRResult[];
}

export function DashboardContent({ ocrData = [] }: DashboardContentProps) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">OCR Results</h2>
      <div className="grid gap-4">
        {ocrData.map((result, index) => (
          <Card key={index} className="p-4">
            <p className="font-medium">{result.text}</p>
            <p className="text-sm text-muted-foreground">
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Position: ({result.coordinates.x1}, {result.coordinates.y1}) to (
              {result.coordinates.x2}, {result.coordinates.y2})
            </p>
          </Card>
        ))}
        {ocrData.length === 0 && (
          <p className="text-muted-foreground">No OCR data available</p>
        )}
      </div>
    </div>
  );
}
