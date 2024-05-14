import { getAuthSession } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return { userId: session?.user };
};

 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const userId = await handleAuth();
      return { userId };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;

