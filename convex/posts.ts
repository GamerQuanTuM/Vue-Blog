import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("Post").collect();
  },
});

export const getSingle = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("Post")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
  },
});

export const getSingleBySubject = query({
  args: { subject: v.string() },
  async handler(ctx, { subject }) {
    if (subject)
      return await ctx.db
        .query("Post")
        .filter((q) => q.eq(q.field("subject"), subject))
        .collect();
    else console.log("Subject not provided");
  },
});

export const paginatedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    subject: v.optional(v.string()),
  },
  handler: async (ctx, {subject,paginationOpts}) => {
    if(subject){
      return await ctx.db.query("Post").filter((q) => q.eq(q.field("subject"), subject)).paginate(paginationOpts);
    }
    return await ctx.db.query("Post").paginate(paginationOpts);
  },
});

export const add = mutation({
  args: {
    description: v.string(),
    image: v.string(),
    subject: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { description, image, subject, title }) => {
    const newPost = await ctx.db.insert("Post", {
      description,
      image,
      subject,
      title,
    });
    return newPost;
  },
});
export const update = mutation({
  args: {
    description: v.string(),
    image: v.string(),
    subject: v.string(),
    title: v.string(),
    _id: v.string(),
  },
  handler: async (ctx, { description, image, subject, title, _id }) => {
    if (_id) {
      const updatedPost = await ctx.db.patch(_id as Id<"Post">, {
        description,
        image,
        subject,
        title,
      });
      return updatedPost;
    }
  },
});

export const _delete = mutation({
  args: {
    _id: v.string(),
  },
  handler: async (ctx, { _id }) => {
    if (_id) {
      await ctx.db.delete(_id as Id<"Post">);
      return `Post Deleted with ${_id}`;
    }
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const storageId = await ctx.storage.generateUploadUrl();
    return storageId;
  },
});

export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }: { storageId: string }) => {
    const imageUrl = await ctx.storage.getUrl(storageId);
    return imageUrl;
  },
});
