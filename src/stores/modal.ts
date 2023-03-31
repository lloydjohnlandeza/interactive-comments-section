import { ref } from 'vue'
import { defineStore } from 'pinia'
import type AppModal from '@/components/AppModal.vue'

export const useModalStore = defineStore('form', () => {
  const modal = ref<InstanceType<typeof AppModal>>()
  return { modal }
})
