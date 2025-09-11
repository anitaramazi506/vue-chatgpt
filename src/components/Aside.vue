<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'

const topics = ref([])
const drawerOpen = ref(true)
const isMobile = ref(false)
const activeTopicId = ref(null)

onMounted(() => {
  const savedTopics = localStorage.getItem("topics")
  if (savedTopics) topics.value = JSON.parse(savedTopics)

  isMobile.value = window.innerWidth < 768
  drawerOpen.value = !isMobile.value

  document.addEventListener('click', (e) => {
    const drawer = document.getElementById('drawer-navigation')
    const toggleButton = document.getElementById('drawer-toggle-btn')
    if (
        drawerOpen.value &&
        isMobile.value &&
        !drawer.contains(e.target) &&
        !toggleButton.contains(e.target)
    ) {
      drawerOpen.value = false
    }
  })
})

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const closeDrawer = () => {
  if (isMobile.value) drawerOpen.value = false
}

const selectTopic = (id) => {
  activeTopicId.value = id
  closeDrawer()
}
</script>

<template>
  <!-- overlay -->
  <div
      v-if="drawerOpen && isMobile"
      @click="closeDrawer"
      class="fixed inset-0 bg-neutral-800 bg-opacity-50 z-30"
  ></div>

  <!-- navbar -->
  <aside
      class="h-15 w-full fixed top-0 right-0 flex justify-between items-center
           bg-neutral-700 dark:bg-neutral-700
           shadow-md dark:shadow-black/40
           z-50"
  >
    <div class="pl-5 flex items-center">
      <!-- toggle button drawer -->
      <button
          id="drawer-toggle-btn"
          @click="toggleDrawer"
          class="p-2 rounded-lg text-white hover:bg-neutral-600
               transition-colors duration-300"
          type="button"
      >
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                d="M5 7h14M5 12h14M5 17h14"/>
        </svg>
      </button>

      <!-- drawer -->
      <div
          :class="[
          'fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform duration-300',
          'bg-white text-gray-900',
          'dark:bg-neutral-800 dark:text-gray-100',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
          id="drawer-navigation"
      >
        <h5
            id="drawer-navigation-label"
            class="text-base font-semibold uppercase tracking-wide
                 text-gray-600 dark:text-gray-400 mb-3"
        >
          Menu
        </h5>

        <button
            @click="toggleDrawer"
            type="button"
            class="absolute top-2 right-2 p-2 rounded-lg
                 text-gray-500 hover:bg-gray-200 hover:text-gray-900
                 dark:text-gray-400 dark:hover:bg-neutral-700 dark:hover:text-white"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0
                     111.414 1.414L11.414 10l4.293 4.293a1 1 0
                     01-1.414 1.414L10 11.414l-4.293 4.293a1 1
                     0 01-1.414-1.414L8.586 10 4.293
                     5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"/>
          </svg>
        </button>

        <ul class="space-y-2 font-medium">
          <li>
            <router-link
                to="/chat"
                @click="closeDrawer"
                class="flex items-center p-2 rounded-lg transition-colors duration-300
                     text-gray-900 dark:text-gray-100
                     hover:bg-gray-200 dark:hover:bg-neutral-700"
            >
              <svg class="w-6 h-6 mr-2 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5c.07 0
                         .14-.007.207-.021.095.014.193.021.293.021h2a2 2 0
                         0 0 2-2V7a1 1 0 0 0-1-1h-1a1 1 0
                         1 0 0 2v11h-2V5a2 2 0 0
                         0-2-2H5Z" clip-rule="evenodd"/>
              </svg>
              <span>New Chat</span>
            </router-link>
          </li>

          <li>
            <a href="#"
               class="flex items-center p-2 rounded-lg transition-colors duration-300
                      text-gray-900 dark:text-gray-100
                      hover:bg-gray-200 dark:hover:bg-neutral-700">
              <svg class="w-6 h-6 mr-2 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-width="2"
                      d="m21 21-3.5-3.5M17 10a7 7 0
                         1 1-14 0 7 7 0 0 1 14 0Z"/>
              </svg>
              <span>Search Chat</span>
            </a>
          </li>

          <li>
            <a href="#"
               class="flex items-center p-2 rounded-lg transition-colors duration-300
                      text-gray-900 dark:text-gray-100
                      hover:bg-gray-200 dark:hover:bg-neutral-700">
              <svg class="w-6 h-6 mr-2 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M5 6a1 1 0 0 1 1-1h12a1 1 0 1 1
                         0 2H6a1 1 0 0 1-1-1Zm0 12a1 1 0 0 1
                         1-1h12a1 1 0 1 1 0 2H6a1 1 0
                         0 1-1-1Z" clip-rule="evenodd"/>
              </svg>
              <span>Sign Out</span>
            </a>
          </li>
        </ul>

        <!-- chats list -->
        <div class="flex flex-col h-96 mt-6">
          <h2 class="text-gray-500 dark:text-gray-400 font-bold mb-2">Chats</h2>
          <ul class="flex-1 overflow-y-auto space-y-1 text-sm">
            <li
                v-for="t in topics"
                :key="t.id"
                :class="[
                'p-2 cursor-pointer rounded-lg transition-colors duration-300',
                activeTopicId === t.id
                  ? 'bg-neutral-200 dark:bg-neutral-600'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
              ]"
            >
              <router-link
                  :to="{ name: 'chat', params: { id: t.id } }"
                  @click="selectTopic(t.id)"
                  class="block w-full text-gray-900 dark:text-gray-100"
              >
                {{ t.title }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- profile -->
        <div class="flex justify-center mt-6">
          <button
              data-popover-target="popover-user-profile"
              type="button"
              class="px-5 py-2.5 text-sm font-medium rounded-lg
                   text-white bg-neutral-600 hover:bg-neutral-500
                   focus:ring-2 focus:outline-none focus:ring-blue-400
                   transition-colors duration-300"
          >
            User Profile
          </button>

          <div
              data-popover
              id="popover-user-profile"
              role="tooltip"
              class="absolute z-10 invisible opacity-0 transition-opacity duration-300
                   w-64 text-sm rounded-xl shadow-lg border
                   bg-white border-gray-200 text-gray-700
                   dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-200 dark:shadow-black/40"
          >
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <img class="w-10 h-10 rounded-full" src="../assets/img/image.jpg" alt="User">
                <button class="px-3 py-1.5 text-xs rounded-lg
                               bg-neutral-600 hover:bg-neutral-500
                               text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Follow
                </button>
              </div>
              <p class="text-base font-semibold text-gray-900 dark:text-white">Anita Ramazi</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">@ani__t.a</p>
              <p class="text-sm mb-4">
                <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">
                  anitaramazi506@gmail.com
                </a>
              </p>
              <ul class="flex text-sm justify-between">
                <li>
                  <span class="font-semibold text-gray-900 dark:text-white">799</span> Following
                </li>
                <li>
                  <span class="font-semibold text-gray-900 dark:text-white">3,758</span> Followers
                </li>
              </ul>
            </div>
            <div data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>

    <!-- logo -->
    <div class="tracking-widest text-xl pr-10 font-[Monoton] text-white">ANITA</div>
  </aside>
</template>
