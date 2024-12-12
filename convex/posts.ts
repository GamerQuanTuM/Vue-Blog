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

export const getCoverPost = query({
  args: {},
  async handler(ctx) {
    return await ctx.db
      .query("Post")
      .filter((q) => q.eq(q.field("cover"), true))
      .collect();
  },
});

export const paginatedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    subject: v.optional(v.string()),
    cover: v.optional(v.boolean()),
  },
  handler: async (ctx, { subject, paginationOpts, cover }) => {
    if (cover) {
      return await ctx.db
        .query("Post")
        .filter((q) => q.eq(q.field("cover"), false))
        .paginate(paginationOpts);
    } else {
      if (subject) {
        return await ctx.db
          .query("Post")
          .filter((q) => q.eq(q.field("subject"), subject))
          .paginate(paginationOpts);
      }
      return await ctx.db.query("Post").paginate(paginationOpts);
    }
  },
});

export const add = mutation({
  args: {
    description: v.string(),
    image: v.string(),
    subject: v.string(),
    title: v.string(),
    cover: v.boolean(),
  },
  handler: async (ctx, { description, image, subject, title, cover }) => {
    let newPost;
    if (cover) {
      const allPosts = await ctx.db.query("Post").collect();
      const updatePromises = allPosts.map((post) =>
        ctx.db.patch(post._id, { cover: false })
      );
      await Promise.all(updatePromises);
      newPost = await ctx.db.insert("Post", {
        description,
        image,
        subject,
        title,
        cover: true,
      });

      return newPost;
    } else {
      newPost = await ctx.db.insert("Post", {
        description,
        image,
        subject,
        title,
        cover: false,
      });

      return newPost;
    }
  },
});

export const update = mutation({
  args: {
    description: v.string(),
    image: v.string(),
    subject: v.string(),
    title: v.string(),
    _id: v.string(),
    cover: v.boolean(),
  },
  handler: async (ctx, { description, image, subject, title, _id, cover }) => {
    console.log("isCover", cover);
    let updatedPost;
    if (_id) {
      if (cover) {
        const currentCoverPost = await ctx.db
          .query("Post")
          .filter((q) => q.eq(q.field("cover"), true))
          .first();

        if (currentCoverPost) {
          await ctx.db.patch(currentCoverPost._id, { cover: false });
        }

        updatedPost = await ctx.db.patch(_id as Id<"Post">, {
          description,
          image,
          subject,
          title,
          cover: true,
        });
      } else {
        updatedPost = await ctx.db.patch(_id as Id<"Post">, {
          description,
          image,
          subject,
          title,
        });
      }

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
