<script setup lang="ts">
  import AppComment from '@/components/AppComment.vue'
  import AppAddComment from '@/components/AppAddComment.vue'
  import data from '../data.json'
  import { reactive } from 'vue'
  import type { IComment } from './types/types';

  const comments = reactive<Array<IComment>>(data.comments)

  const findObjectByIndices = (data: Array<IComment>, indices: Array<number>): IComment | null => {
    const index = indices.shift() as number;
    const obj = data[index];
    if (!obj) {
      return null;
    }
    if (indices.length === 0) {
      return obj;
    }
    return findObjectByIndices(obj.replies || [], indices);
  };

  const handleUpvote = (ids: Array<number>) => {
    const comment = findObjectByIndices(comments, ids)
    if (!comment) return
    const change = comment.downVoted ? 2 : 1
    if (comment.upVoted) {
      comment.score = comment.score - change
      comment.upVoted = false
    } else {
      comment.score = comment.score + change
      comment.upVoted = true
      comment.downVoted = false
    }
  }

  const handleDownVote = (ids: Array<number>) => {
    const comment = findObjectByIndices(comments, ids)
    if (!comment) return
    const change = comment.upVoted ? 2 : 1
    if (comment.downVoted) {
      comment.score = comment.score + change
      comment.downVoted = false
    } else {
      comment.score = comment.score - change
      comment.downVoted = true
      comment.upVoted = false
    }
  }
  const newComment = (comment: IComment) => {
    comments.push(comment)
  }
  const test = (e) => {
    console.log(e)
  }
</script>

<template>
  <main>
    <app-comment
      v-for="(item, index) in comments" :key="index"
      v-bind="item"
      :index="index"
      :currentUser="data.currentUser"
      @replied="test"
      @upVote="handleUpvote"
      @downVote="handleDownVote"
    ></app-comment>
    <app-add-comment
      :currentUser="data.currentUser"
      @send="newComment"
    />
  </main>
</template>

<style scoped>
</style>

