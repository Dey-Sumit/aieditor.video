// app/api/assets/route.ts
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "~/lib/aws-config";

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
    });

    const response = await s3Client.send(command);

    const assets =
      response.Contents?.map((item) => ({
        key: item.Key,
        url: `https://${process.env.BUCKET_NAME}.s3.us-east-1.amazonaws.com/${item.Key}`,
        lastModified: item.LastModified,
        size: item.Size,
      })) || [];

    return Response.json({ assets });
  } catch (error) {
    console.error("Error listing assets:", error);
    return Response.json({ error: "Failed to list assets" }, { status: 500 });
  }
}
