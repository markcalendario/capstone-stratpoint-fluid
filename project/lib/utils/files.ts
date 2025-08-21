import { put } from "@vercel/blob";

interface UploadParams {
  file: File;
}

export async function upload({ file }: UploadParams): Promise<string> {
  const ext = file.type.split("/")[1];
  const fileName = `pf-${Date.now()}.${ext}`;

  const { url } = await put(fileName, file, { access: "public" });

  return url;
}
