<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { PropType } from 'vue';
  import type { IComment, IUser } from '@/types/types';
  import { v4 as uuidv4 } from 'uuid';

  type BtnLabel = 'Reply' | 'Send' | 'Update'
  const props = defineProps({
    currentUser: {
      type: Object as PropType<IUser>,
      required: true
    },
    buttonLabel: {
      type: String as PropType<BtnLabel>,
      default: 'Send'
    },
    showImage: {
      type: Boolean,
      default: true
    },
    initComment: {
      type: String,
      default: ''
    }
  })
  const emit = defineEmits<{
    (event: 'send', value: IComment): void;
  }>();

  const img = computed(() => {
    return new URL(`/src/assets/avatars/${props.currentUser.image.webp}`, import.meta.url).href
  })

  const comment = ref(props.initComment)

  const handleSubmit = () => {
    if (comment.value === '') return
    const commentObject: IComment = {
      id: uuidv4(),
      content: comment.value,
      createdAt: new Date().toISOString(),
      score: 1,
      user: props.currentUser,
      upVoted: true,
      replies: []
    }
    emit('send', commentObject)
    comment.value = ''
  }
</script>

<template>
  <div class="bg-white p-4 rounded-lg grid grid-cols-2 gap-4 mb-2 sm:grid-cols-[auto_1fr_auto]">
    <textarea class="col-span-2 sm:col-start-2 sm:col-end-2 border-light-gray border-solid border focus-visible:border-dark-blue p-3 resize-none h-24 placeholder:font-medium focus-visible:outline-none outline-none transition-all"  v-model="comment" name="comment" placeholder="Add a comment..."></textarea>
    <img class="col-span-1 sm:row-start-1 w-10" v-if="showImage" :alt="`${currentUser.username} image`" :src="img" />
    <button aria-label="Send comment" :class="{'col-span-2': !showImage}" class="col-span-1 self-start ml-auto bg-moderate-blue text-white transition-all hover:opacity-70 rounded-md min-w-[100px] p-2 uppercase font-medium" @click="handleSubmit">{{buttonLabel}}</button>
  </div>
</template>
