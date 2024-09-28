import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/sendImage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const blob = new Blob([file], { type: file.type });
    const storageId = await ctx.storage.store(blob as Blob);
    console.log("Storage ID:", storageId);

    if (storageId) {
      const imageUrl = await ctx.runQuery(api.posts.getImageUrl, { storageId });
      return new Response(imageUrl, {
        status: 200,
      });
    } else {
      return new Response("Storage ID not found", {
        status: 400,
      });
    }
  }),
});

export default http;
