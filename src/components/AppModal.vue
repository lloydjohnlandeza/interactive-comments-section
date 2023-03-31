<script setup lang="ts">
  import { ref } from 'vue'

  const isOpen = ref(false)
  const titleRef = ref()
  const contentRef = ref()
  const cancelLabel = ref('')
  const confirmLabel = ref('')
  const resolveFn = ref()

  const openModal = async ({ title = 'Default Title', content = 'Default Content', cancel = 'No, Cancel', confirm = 'Yes, Delete' }) => {
    titleRef.value = title;
    contentRef.value = content;
    cancelLabel.value = cancel;
    confirmLabel.value = confirm;
    isOpen.value = true;
    return new Promise<boolean>((resolve) => {
      resolveFn.value = resolve
    });
  };


  const confirm = () => {
    isOpen.value = false
    resolveFn.value && resolveFn.value(true)
  }
  const cancel = () => {
    isOpen.value = false
    resolveFn.value && resolveFn.value(false)
  }

  defineExpose({ openModal })
</script>

<template>
  <Transition
    :duration="1000"
  >
    <div v-if="isOpen" :class="{'pointer-events-none': !isOpen}" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="backdrop fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full justify-center p-4 items-center">
          <div class="modal-content relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-xs">
            <div class="bg-white p-4 sm:p-6">
              <h3 class="text-base font-medium leading-6 text-dark-blue" id="modal-title">{{ titleRef }}</h3>
              <div class="mt-2">
                <p class="text-sm text-grayish-blue">{{ contentRef }} {{ isOpen }}</p>
              </div>
            </div>
            <div class="px-4 sm:px-4 pt-0 pb-4 sm:pb-4 flex justify-end gap-2">
              <button aria-label="Cancel delete" @click="cancel" type="button" class="inline-flex uppercase justify-center rounded-md bg-grayish-blue px-3 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:opacity-70 w-full">{{cancelLabel}}</button>
              <button aria-label="Confirm delete" @click="confirm" type="button" class="inline-flex uppercase justify-center rounded-md bg-soft-red px-3 py-2 text-sm text-white shadow-sm hover:opacity-70 w-full">{{ confirmLabel}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>


<style lang="scss">
// opacity-100
// opacity-0
  .v-enter-to {
    .backdrop {
      @apply opacity-100;
    }
    .modal-content {
      @apply opacity-100 translate-y-0 sm:scale-100;
    }
  }
  .v-enter-from {
    .backdrop {
      @apply opacity-0;
    }
    .modal-content {
      @apply opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95;
    }
  }
  .v-leave-from {
    .backdrop {
      @apply opacity-100;
    }
    .modal-content {
      @apply opacity-100 translate-y-0 sm:scale-100;
    }
  }
  .v-leave-to {
    .backdrop {
      @apply opacity-0;
    }
    .modal-content {
      @apply opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95;
    }
  }
</style>