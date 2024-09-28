import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  Post: defineTable({
    description: v.string(),
    image: v.string(),
    subject: v.string(),
    title: v.string(),
    comment: v.optional(v.array(v.id("Comment"))),
  }),
  Comment: defineTable({
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
    post:v.id("Post")
  }),
});
