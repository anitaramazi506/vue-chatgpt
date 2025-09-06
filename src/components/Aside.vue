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


  <!-- overlay موبایل -->
  <div v-if="drawerOpen && isMobile"
       @click="closeDrawer"
       class="fixed inset-0 bg-neutral-700 bg-opacity-50 z-30"></div>

  <!-- navbar -->
  <aside class="h-15 w-full bg-neutral-700 fixed top-0 right-0 flex justify-between items-center z-1000">
    <div class="pl-5 flex items-center">
      <!-- toggle button  drawer -->
      <button @click="toggleDrawer" class="text-white hover:bg-neutral-700 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-neutral-700 focus:outline-none" type="button">
        <svg class="w-10 h-10 text-neutral-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
             width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
        </svg>
      </button>

      <!-- drawer -->
      <div :class="[
            'fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-neutral-800',
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          ]"
           id="drawer-navigation" tabindex="-1" aria-labelledby="drawer-navigation-label">

        <h5 id="drawer-navigation-label" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
        <button @click="toggleDrawer" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          <span class="sr-only">Close menu</span>
        </button>
        <div class="py-4 overflow-y-auto">
          <ul class="space-y-2 font-medium">
            <li>
              <router-link to="/chat" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5c.07 0 .14-.007.207-.021.095.014.193.021.293.021h2a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2v11h-2V5a2 2 0 0 0-2-2H5Zm7 4a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm-6 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1ZM7 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7Zm1 3V8h1v1H8Z" clip-rule="evenodd"/>
                </svg>

                <span class="ms-3" >new chat</span>
              </router-link>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>

                <span class="flex-1 ms-3 whitespace-nowrap">search chat</span>
                <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M5 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm0 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm3.85-9.76A1 1 0 0 1 10.5 9v6a1 1 0 0 1-1.65.76l-3.5-3a1 1 0 0 1 0-1.52l3.5-3ZM12 10a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                </svg>

                <span class="flex-1 ms-3 whitespace-nowrap">sign out</span>
              </a>
            </li>


            <!-- chats list -->
            <div class="flex flex-col h-96 text-white ">

              <h2 class="text-gray-500 font-bold mb-2 shrink-0">---chats---</h2>


              <ul class="flex-1 overflow-y-auto space-y-1  text-sm">
                <li
                    v-for="t in topics"
                    :key="t.id"
                    :class="['p-2 cursor-pointer hover:bg-neutral-700 rounded-ee-lg', activeTopicId === t.id ? 'bg-neutral-300 dark:bg-neutral-600' : '']"
                >
                  <router-link
                      :to="{name:'chat', params:{id: t.id}}"
                      @click="selectTopic(t.id)"
                      class="block w-full"
                  >
                    {{ t.title }}
                  </router-link>
                </li>
              </ul>
            </div>



            <!--              profile-->
            <div class="flex justify-center   items-center w-50  z-1000" >

              <button data-popover-target="popover-user-profile" type="button" class="text-white bg-neutral-600 hover:bg-neutral-400 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center   dark:focus:ring-white">User profile</button>

              <div data-popover id="popover-user-profile" role="tooltip" class="absolute z-10 invisible inline-block  w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:bg-neutral-700 dark:border-gray-600">
                <div class="p-3">
                  <div class="flex items-center justify-between mb-2">
                    <a href="#">
                      <img class="w-10 h-10 rounded-full" src="../assets/img/image.jpg" alt="Jese Leos">
                    </a>
                    <div>
                      <button type="button" class="text-white bg-neutral-600 hover:bg-neutral-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5  focus:outline-none  dark:focus:ring-white">Follow</button>
                    </div>
                  </div>
                  <p class="text-base font-semibold leading-none text-gray-900 dark:text-white">
                    <a href="#">Anita ramazi</a>
                  </p>
                  <p class="mb-3 text-sm font-normal">
                    <a href="#" class="hover:underline">@ani__t.a</a>
                  </p>
                  <p class="mb-4 text-sm"><a href="#" class="text-blue-600 dark:text-blue-500 hover:underline">anitaramazi506@gmail.com</a>.</p>
                  <ul class="flex text-sm">
                    <li class="me-2">
                      <a href="#" class="hover:underline">
                        <span class="font-semibold text-gray-900 dark:text-white">799</span>
                        <span>Following</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" class="hover:underline">
                        <span class="font-semibold text-gray-900 dark:text-white">3,758</span>
                        <span>Followers</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>


          </ul>
        </div>
      </div>


    </div>
    <div class="tracking-widest text-xl pr-10 text-white font-[Monoton]">ANITA</div>
  </aside>



</template>

<style>


</style>