<script setup lang="ts">
  import type { PropType } from 'vue'
  // import AppBox from './AppBox.vue'
  // import AppCheckbox from './AppCheckbox.vue';
  // import { useFormStore, type IAmount } from '@/stores/form'
  // import { storeToRefs } from 'pinia';
  import IconPlus from './icons/IconPlus.vue'
  import IconMinus from './icons/IconMinus.vue'
  import IconReply from './icons/IconReply.vue'

  interface IUser {
    username: string,
    image: {
      png: string,
      webp: string
    }
  }

  interface IComments {
    id: string | number
    parentId?: string
    content: string
    createdAt: string,
    score: number,
    user: IUser
    replies?: Array<IComments>
  }

  defineProps({
    id: {
      type: [String, Number],
      required: true
    },
    parentId: {
      type: [String, Number],
      required: false
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
      type: Array as PropType<Array<IComments>>,
      required: false
    },
  })
</script>

<template>
  <div class="comment">
    <div class="header">
      <img :src="user.image.webp" />
      <span class="username">{{ user.username }}</span>
      <span class="date">{{ createdAt }}</span>
    </div>
    <div class="content">
      {{ content }}
    </div>
    <div class="score-container">
      <button>
        <IconPlus />
      </button>
      {{ score }}
      <button>
        <IconMinus />
      </button>
    </div>
    <div class="reply-container">
      <button>
        <IconReply />
        Reply
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .comment {
    background: var(--white);
    border-radius: 20px;
    padding: 20px;
    margin: 15px;
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
      }
    }
    .reply-container {
      align-self: center;
      text-align: right;
      grid-column: 2;
      button {
        margin-left: auto;
        font-weight: 700;
        color: var(--moderate-blue);
        fill: var(--moderate-blue);
        &:hover {
          background: var(--very-light-gray);
          color: var(--dark-blue);
          fill: var(--dark-blue);
        }
      }
    }
  }
</style>

