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
    }
  })
  const emit = defineEmits<{
    (event: 'send', value: IComment): void;
  }>();

  const img = computed(() => {
    return new URL(props.currentUser.image.webp, import.meta.url).toString()
  })

  const comment = ref('')

  const handleSubmit = () => {
    const commentObject: IComment = {
      id: uuidv4(),
      content: comment.value,
      createdAt: 'Just Now',
      score: 1,
      user: props.currentUser,
      upVoted: true
    }
    emit('send', commentObject)
    comment.value = ''
  }
</script>

<template>
  <div class="card">
    <textarea v-model="comment" name="comment" placeholder="Add a comment..."></textarea>
    <img :src="img" />
    <button @click="handleSubmit">{{buttonLabel}}</button>
  </div>
</template>

<style lang="scss" scoped>
  .card {
    display: grid;
    gap: 20px;
    textarea {
      grid-column: 1/4;
      width: 100%;
      padding: 10px;
      height: 100px;
      resize: none;
      border: solid 1px var(--light-gray);
      outline: none !important;
      transition: all .3s ease;
      &:focus {
        border: solid 1px var(--grayish-blue);
      }
      &::placeholder {
        font-family: 'Rubik';
      }
    }
    > img {
      max-width: 30px;
      height: auto;
      grid-column: 1;
    }
    > button {
      grid-column: 3;
      margin-left: auto;
      font-weight: 500;
      background-color: var(--moderate-blue);
      border: solid 1px var(--white);
      padding: 10px 20px;
      border-radius: 5px;
      color: var(--white);
      text-transform: uppercase;
      &:hover {
        background-color: var(--white);
        border: solid 1px var(--moderate-blue);
        color: var(--moderate-blue);
      }
    }
  }
</style>

