<script lang="ts" setup>
import Navbar from "@/components/Navbar.vue"
import { useConvexPaginatedQuery } from "@convex-vue/core";
import { api } from "../../convex/_generated/api";
import SubjectWisePostComponent from "@/components/SubjectWisePostComponent.vue";

const {
  data: paginatedPosts,
  isLoading,
  isLoadingMore,
  isDone,
  loadMore,

} = useConvexPaginatedQuery(api.posts.paginatedPosts, { subject: "Gaming" }, { numItems: 3 });


</script>

<template>
  <Navbar navLink="Gaming">
    <SubjectWisePostComponent :posts="paginatedPosts" :isLoading="isLoading" :isLoadingMore="isLoadingMore"
      :isDone="isDone" :loadMore="loadMore" />
  </Navbar>
</template>
