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
    (event: 'replied', value: { ids: Array<number> | number, reply: IComment }): void;

  }>();

  const isReplying = ref(false)

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

  const replySent = (event: { ids: Array<number> | number, reply: IComment }) => {
    let newIds = []
    if (Array.isArray(event.ids)) {
      newIds = [props.index, ...event.ids]
    } else {
      newIds.push(event.ids)
    }
    emit('replied', { ids: newIds, reply: event.reply })
  }
</script>

<template>
  <div class="comment-container">
    <div class="comment card">
      <div class="header">
        <img :src="img" />
        <span class="username">{{ user.username }}</span>
        <span class="date">{{ createdAt }}</span>
      </div>
      <div class="content">
       <span v-if="replyingTo"  >{{ `@${replyingTo}` }}</span> {{ content }}
      </div>
      <div class="score-container">
        <button :class="{ 'up-voted' : upVoted}" @click="handleUpvote(index)">
          <IconPlus />
        </button>
        {{ score }}
        <button :class="{ 'down-voted' : downVoted}" @click="handleDownvote(index)">
          <IconMinus />
        </button>
      </div>
      <div v-if="user.username !== currentUser.username" class="button-container">
        <button @click="isReplying = !isReplying">
          <IconReply />
          Reply
        </button>
      </div>
      <div v-else class="button-container">
        <button class="btn-soft-red">
          Delete
        </button>
        <button>
          Edit
        </button>
      </div>
    </div>
    <app-add-comment
      v-if="isReplying"
      button-label="Reply"
      :current-user="currentUser"
      @send="replySent({ ids: index, reply: $event })"
    />
    <div v-if="replies && replies.length" class="comment-list">
      <app-comment
        v-for="(item, index) in replies" :key="index"
        :index="index"
        :currentUser="currentUser"
        v-bind="item"
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
        background-color: var(--light-grayish-blue);
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

