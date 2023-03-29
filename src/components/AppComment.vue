<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { PropType } from 'vue'
  import IconPlus from './icons/IconPlus.vue'
  import IconMinus from './icons/IconMinus.vue'
  import IconReply from './icons/IconReply.vue'
  import type { IUser, IComment } from '@/types/types'
  import AppAddComment from './AppAddComment.vue'

  const props = defineProps({
    id: {
      type: [String, Number],
      required: true
    },
    currentUser: {
      type: Object as PropType<IUser>,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    user: {
      type: Object as PropType<IUser>,
      required: true
    },
    replies: {
      type: Array as PropType<Array<IComment>>,
      required: false
    },
    replyingTo: {
      type: String,
      required: false
    },
    upVoted: {
      type: Boolean,
      required: false
    },
    downVoted: {
      type: Boolean,
      required: false
    }
  })

  const emit = defineEmits<{
    (event: 'upVote', value: Array<number>): void;
    (event: 'downVote', value: Array<number>): void;
    (event: 'replied', value: { indices: Array<number>, reply: IComment }): void;
    (event: 'updated', value: { indices: Array<number>, reply: IComment }): void;
    (event: 'deleted', value: Array<number> ): void;
  }>();

  const isReplying = ref(false)
  const isEdting = ref(false)
  const isDeleting = ref(false)

  const img = computed(() => {
    return new URL(props.user.image.webp, import.meta.url).toString()
  })


  const handleUpvote = (event: Array<number> | number) => {
    let newIds = []
    if (Array.isArray(event)) {
      newIds = [props.index, ...event]
    } else {
      newIds.push(event)
    }
    emit('upVote', newIds)
  }

  const handleDownvote = (event: Array<number> | number) => {
    let newIds = []
    if (Array.isArray(event)) {
      newIds = [props.index, ...event]
    } else {
      newIds.push(event)
    }
    emit('downVote', newIds)
  }

  const replySent = (event: { indices: Array<number> | number, reply: IComment }) => {
    let newIds = []
    if (Array.isArray(event.indices)) {
      newIds = [props.index, ...event.indices]
    } else {
      newIds.push(event.indices)
    }
    isReplying.value = false
    emit('replied', { indices: newIds, reply: event.reply })
  }

  const updateComment = (event: { indices: Array<number> | number, reply: IComment }) => {
    let newIds = []
    if (Array.isArray(event.indices)) {
      newIds = [props.index, ...event.indices]
    } else {
      newIds.push(event.indices)
    }
    emit('updated', { indices: newIds, reply: event.reply })
    isEdting.value = false
  }

  const deleteComment = (indices: Array<number> | number) => {
    let newIds = []
    if (Array.isArray(indices)) {
      newIds = [props.index, ...indices]
    } else {
      newIds.push(indices)
    }
    emit('deleted', newIds)
    isDeleting.value = false
    isEdting.value = false
  }
</script>

<template>
  <div class="comment-container">
    <div class="bg-white p-4 rounded-lg grid grid-cols-2 gap-4 mb-5">
      <div class="flex col-span-3 items-center gap-4 ">
        <img class="w-10" :src="img" />
        <span class="font-rubik font-bold text-dark-blue">{{ user.username }}</span>
        <span class="text-grayish-blue">{{ createdAt }}</span>
      </div>
      <div class="col-span-3">
        <app-add-comment
          v-if="isEdting"
          button-label="Update"
          :init-comment="content"
          :show-image="false"
          :current-user="currentUser"
          @send="updateComment({ indices: index, reply: $event })"
        />
        <div v-else>
          <span v-if="replyingTo" class="font-medium text-moderate-blue" >{{ `@${replyingTo}` }}</span> <span class="font-rubik text-grayish-blue">{{ content }}</span>
        </div>
      </div>
      <div class="bg-very-light-gray col-start-1 max-w-max rounded-lg">
        <button class="p-3 fill-grayish-blue hover:opacity-70 transition-all" :class="{ 'fill-soft-red' : upVoted}" @click="handleUpvote(index)">
          <IconPlus />
        </button>
        <span class="text-moderate-blue font-medium">{{ score }}</span>
        <button class="p-3 fill-grayish-blue hover:opacity-70 transition-all" :class="{ 'fill-soft-red' : downVoted}" @click="handleDownvote(index)">
          <IconMinus />
        </button>
      </div>
      <div v-if="user.username !== currentUser.username" class="col-start-2 ml-auto max-w-max">
        <button class="flex items-center gap-2 text-moderate-blue fill-moderate-blue font-medium hover:opacity-70 transition-all" @click="isReplying = !isReplying">
          <IconReply />
          Reply
        </button>
      </div>
      <div v-else class="col-start-2 ml-auto max-w-max">
        <button class="btn-soft-red" @click="deleteComment(index)">
          Delete
        </button>
        <button @click="isEdting = !isEdting">
          Edit
        </button>
      </div>
    </div>

    <app-add-comment
      v-if="isReplying"
      button-label="Reply"
      :current-user="currentUser"
      @send="replySent({ indices: index, reply: $event })"
    />

    <div v-if="replies && replies.length" class="relative pl-4 comment-list">
      <app-comment
        v-for="(item, index) in replies" :key="index"
        :index="index"
        :currentUser="currentUser"
        v-bind="item"
        @deleted="deleteComment"
        @updated="updateComment"
        @replied="replySent"
        @down-vote="handleDownvote"
        @up-vote="handleUpvote"

      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .comment-container {
    position: relative;
    .comment-list {
      padding-left: 20px;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        margin-left: 2px;
        height: 100%;
        width: 1px;
        background-color: var(--light-gray);
      }
    }
  }
  .comment {
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    display: grid;
    .header {
      display: flex;
      align-items: center;
      gap: 15px;
      grid-column: 1/3;
      img {
        width: 30px;
      }
      .username {
        color: var(--dark-blue);
        font-weight: 700;
      }
    }
    .content {
      margin: 15px 0;
      grid-column: 1/3;
      > .card {
        padding: 0;
      }
      span {
        font-weight: 500;
        color: var(--moderate-blue);
      }
    }
    .score-container {
      display: flex;
      align-self: flex-start;
      align-items: center;
      grid-column: 1;
      max-width: max-content;
      background-color: var(--very-light-gray);
      border-radius: 10px;
      color: var(--moderate-blue);
      font-weight: 500;
      button {
        padding: 8px 15px;
        color: var(--grayish-blue);
        transition: all .3s ease;
        > svg {
          fill: var(--grayish-blue);
          transition: all .3s ease;
        }
        &:hover {
          color: var(--moderate-blue);
          > svg {
            fill: var(--dark-blue);
          }
        }
        &.up-voted {
          > svg {
            fill: var(--soft-red);
          }
        }
        &.down-voted {
          > svg {
            fill: var(--pale-red);
          }
        }
      }
    }
    .button-container {
      display: flex;
      align-self: center;
      text-align: right;
      grid-column: 2;
      button {
        &:first-child {
          margin-left: auto;
        }
        font-weight: 700;
        color: var(--moderate-blue);
        fill: var(--moderate-blue);
        &.btn-soft-red {
          color: var(--soft-red);
        }
        &:hover {
          background: var(--very-light-gray);
          color: var(--dark-blue);
          fill: var(--dark-blue);
        }
      }
    }
  }
</style>

