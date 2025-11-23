import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const cloudwatch = new CloudWatchClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const environment = process.env.NODE_ENV === "production" ? "production" : "local";

export async function publishMetric(
  metricName: string,
  value: number,
  unit: "Count" | "Milliseconds" | "Seconds"
) {
  try {
    const command = new PutMetricDataCommand({
      Namespace: "SaleNotesApp",
      MetricData: [
        {
          MetricName: metricName,
          Dimensions: [
            { Name: "Environment", Value: environment }
          ],
          Unit: unit,
          Value: value,
          Timestamp: new Date()
        }
      ]
    });

    await cloudwatch.send(command);
  } catch (err) {
    console.error("CloudWatch metric error:", err);
  }
}
