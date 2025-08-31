<script setup>





defineProps({
  text: String,
  time: String
})



</script>
<template>

  <div class="flex items-start gap-2.5 justify-start relative mt-2  bottom-32 w-full  overflow-auto">

    <div id="aimessage" class="flex flex-col md:w-full  w-60 max-w-[320px]    leading-1.5 p-4 border-neutral-200 bg-neutral-100 rounded-e-xl rounded-ss-xl
 dark:bg-neutral-800">
      <div class="flex items-center space-x-2 font-bold rtl:space-x-reverse">
        <span class="text-sm font-semibold text-neutral-900 dark:text-white">Ai joon</span>
        <span class="text-sm font-normal text-neutral-600 dark:text-neutral-400">{{time}}</span>
      </div>
      <p class="text-sm font-normal py-2.5 text-neutral-900 dark:text-white"  > {{text}}</p>
      <span class="text-sm font-normal text-neutral-500 dark:text-neutral-400">sent</span>
    </div>
    <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start"
            class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-neutral-900 bg-white rounded-lg hover:bg-neutral-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:ring-neutral-600"
            type="button">
      <svg class="w-4 h-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
           fill="currentColor" viewBox="0 0 4 15">
        <path
            d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
      </svg>
    </button>
    <div id="dropdownDots"
         class="z-10 hidden bg-white divide-y divide-neutral-100 rounded-lg shadow-sm w-40 dark:bg-neutral-700 dark:divide-neutral-600">
      <ul class="py-2 text-sm text-neutral-700 dark:text-neutral-200" aria-labelledby="dropdownMenuIconButton">
        <li>
          <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Reply</a>
        </li>
        <li>
          <a href="#"
             class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Forward</a>
        </li>
        <li>
          <a href="#" class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Copy</a>
        </li>
        <li>
          <a href="#"
             class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Report</a>
        </li>
        <li>
          <a href="#"
             class="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white">Delete</a>
        </li>
      </ul>
    </div>
  </div>
</template>