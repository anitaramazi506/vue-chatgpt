<script setup>
defineProps({
  text: String,
  time: String
})
</script>
<template>
  <div class="flex start gap-2.5   mt-15 justify-end relative bottom-32   ">

    <div class="flex flex-col md:w-full w-60 max-w-[320px] leading-1.5 p-4 bg-neutral-200 rounded-s-xl rounded-ee-xl
 dark:bg-neutral-900">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-neutral-900 dark:text-white">me</span>
        <span class="text-sm font-normal text-neutral-500 dark:text-neutral-400">{{time}}</span>
      </div>
      <p class="text-sm font-normal py-2.5 text-neutral-900 dark:text-white">
      {{text}}
      </p>
      <span class="text-sm font-normal text-neutral-500 dark:text-neutral-400">Delivered</span>
    </div>


    <img src="../assets/img/image.jpg" class="w-8 h-8 rounded-full object-cover" alt="your profile"/>
  </div>
</template>