<script setup lang="ts">
  import AppComment from '@/components/AppComment.vue'
  import AppAddComment from '@/components/AppAddComment.vue'
  import AppModal from '@/components/AppModal.vue'
  import data from '../data.json'
  import { reactive } from 'vue'
  import type { IComment } from './types/types';
  import { storeToRefs } from 'pinia';
  import { useModalStore } from '@/stores/modal'

  const store = useModalStore()
  const { modal } = storeToRefs(store)

  const comments = reactive<Array<IComment>>(data.comments)

  const findCommentByIndices = (data: Array<IComment>, indices: Array<number>): IComment | null => {
    const index = indices.shift() as number;
    const obj = data[index];
    if (!obj) {
      return null;
    }
    if (indices.length === 0) {
      return obj;
    }
    return findCommentByIndices(obj.replies, indices);
  };

  const newComment = (comment: IComment) => {
    comments.push(comment)
  }

  const handleUpvote = (indices: Array<number>) => {
    const comment = findCommentByIndices(comments, indices)
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

  const handleDownVote = (indices: Array<number>) => {
    const comment = findCommentByIndices(comments, indices)
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


  const handleReply = (event: { indices: Array<number>, reply: IComment }) => {
    const comment = findCommentByIndices(comments, event.indices)
    if (!comment) return
    const reply = {
      ...event.reply,
      replyingTo: comment.user.username
    }
    comment.replies.push(reply)
  }

  const handleUpdate = (event: { indices: Array<number>, reply: IComment }) => {
    const comment = findCommentByIndices(comments, event.indices)
    if (!comment) return
    comment.content = event.reply.content
  }

  const handleDelete = (indices: Array<number>) => {
    if (indices.length <= 0) return

    if (indices.length === 1) {
      comments.splice(indices[0], 1)
      return
    }
    const parentComment = indices.shift() as number
    const childComment = indices.pop() as number
    let data = comments[parentComment]

    for (let index = 0; index < indices.length; index++) {
      const element = indices[index];
      data = data.replies[element]
    }
    data.replies.splice(childComment, 1)
  }
</script>

<template>
  <main>
    <app-modal ref="modal" />
    <app-comment
      v-for="(item, index) in comments" :key="index"
      v-bind="item"
      :index="index"
      :currentUser="data.currentUser"
      @deleted="handleDelete"
      @updated="handleUpdate"
      @replied="handleReply"
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

