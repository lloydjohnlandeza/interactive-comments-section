<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { PropType } from 'vue'
  import IconPlus from './icons/IconPlus.vue'
  import IconMinus from './icons/IconMinus.vue'
  import IconReply from './icons/IconReply.vue'
  import IconDelete from './icons/IconDelete.vue'
  import IconPencil from './icons/IconPencil.vue'
  import type { IUser, IComment } from '@/types/types'
  import AppAddComment from './AppAddComment.vue'
  import { storeToRefs } from 'pinia';
  import { useModalStore } from '@/stores/modal'

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const store = useModalStore()
  const { modal } = storeToRefs(store)
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
    return new URL(`/src/assets/avatars/${props.user.image.webp}`, import.meta.url).href
  })

  const createdAtFromNow = computed(() => {
    return dayjs(props.createdAt).fromNow()
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
  const deletConfirmation = async (index: number) => {
    if (!await modal.value?.openModal({ title: 'Delete comment', content: 'Are you sure you want to delete this comment? This will remove the comment and can\'t be undone.'})) {
      return
    }
    deleteComment(index)
  }
  const deleteComment = async (indices: Array<number> | number) => {
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
  <div class="comment-container relative">
    <div class="bg-white p-2 sm:p-4 rounded-lg grid grid-cols-2 sm:grid-cols-[auto_1fr_auto]  gap-2 sm:gap-4 mb-5">
      <div class="flex col-span-3 sm:col-start-2 sm:col-end-3 items-center gap-2 sm:gap-4 ">
        <img class="w-10" :src="img" />
        <span class="font-rubik font-bold text-dark-blue">{{ user.username }}</span>
        <span class="px-2 rounded-sm font-medium bg-moderate-blue text-white" v-if="user.username === currentUser.username">you</span>
        <span class="text-grayish-blue">{{ createdAtFromNow }}</span>
      </div>
      <div class="col-span-3 sm:col-start-2 sm:col-end-4">
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
      <div class="bg-very-light-gray col-start-1 max-w-max rounded-lg sm:col-1 sm:row-start-1 sm:row-end-3 sm:flex sm:flex-col sm:items-center sm:self-start sm:col-auto">
        <button class="p-3 fill-grayish-blue hover:opacity-70 transition-all" :class="{ 'fill-soft-red' : upVoted}" @click="handleUpvote(index)">
          <IconPlus />
        </button>
        <span class="text-moderate-blue font-medium">{{ score }}</span>
        <button class="p-3 fill-grayish-blue hover:opacity-70 transition-all" :class="{ 'fill-soft-red' : downVoted}" @click="handleDownvote(index)">
          <IconMinus />
        </button>
      </div>
      <div v-if="user.username !== currentUser.username" class="col-start-2 ml-auto max-w-max sm:row-start-1 sm:col-start-3">
        <button class="flex items-center gap-2 text-moderate-blue fill-moderate-blue font-medium hover:opacity-70 transition-all" @click="isReplying = !isReplying">
          <IconReply />
          Reply
        </button>
      </div>
      <div v-else class="flex col-start-2 ml-auto max-w-max sm:row-start-1 sm:col-start-3 gap-4">
        <button class="text-soft-red fill-soft-red font-medium hover:opacity-70 transition-all flex items-center gap-2" @click="deletConfirmation(index)">
          <IconDelete />
          Delete
        </button>
        <button class="text-moderate-blue fill-moderate-blue font-medium hover:opacity-70 transition-all flex items-center gap-2" @click="isEdting = !isEdting">
          <IconPencil />
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

    <div v-if="replies && replies.length" class="relative pl-4 sm:pl-16 comment-list before:left-1 sm:before:left-8">
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
    .comment-list {
      &:before {
        content: '';
        position: absolute;
        top: 0;
        height: 100%;
        width: 1px;
        background-color: var(--light-gray);
      }
    }
  }
</style>

