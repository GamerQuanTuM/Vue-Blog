import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("Comment").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    comment: v.string(),
    subcomment: v.optional(
      v.array(
        v.object({
          name: v.string(),
          email: v.string(),
          comment: v.string(),
        })
      )
    ),
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const newComment = await ctx.db.insert("Comment", {
      ...args,
    });

    return newComment;
  },
});

export const update = mutation({
  args: {
    _id: v.string(),
    name: v.string(),
    email: v.string(),
    comment: v.string(),
    subcomment: v.optional(
      v.array(
        v.object({
          name: v.string(),
          email: v.string(),
          comment: v.string(),
        })
      )
    ),
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedComment = await ctx.db.patch(args._id as Id<"Comment">, {
      ...args,
    });

    return updatedComment;
  },
});

export const _delete = mutation({
  args: {
    _id: v.string(),
  },
  handler: async (ctx, { _id }) => {
    if (_id) {
      await ctx.db.delete(_id as Id<"Comment">);
      return `Comment Deleted with ${_id}`;
    }
  },
});
export const getByPostId = query({
  args: { postId: v.string() },
  handler: async (ctx, { postId }) => {
    const comments = await ctx.db
      .query("Comment")
      .filter((q) => q.eq(q.field("postId"), postId))
      .collect();
    return comments;
  },
});
