<script setup>
import {ref, nextTick, onMounted, watch} from 'vue';
import senderMsg from "../components/senderMsg.vue"
import aiMsg from "../components/aiMsg.vue"
import { useRoute } from 'vue-router'
const route = useRoute()

import OpenAI from 'openai';
import {useRouter} from 'vue-router'


const router = useRouter()

const newChat = () => {
  const newId = Date.now().toString()
  router.push({name: 'Chat', params: {id: newId}})
}


const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  baseURL: 'https://ai.liara.ir/api/v1/68809a637c37ffa36a7c85ec',
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDdjNTUwYmQ1YzIwYTVlYThiODE0YzgiLCJ0eXBlIjoiYXV0aCIsImlhdCI6MTc1NTQxNDM5OH0.YsgaA3lhuOjbidVVrM3lJonfzmHO05cIbp2uHHgiJh0',
});




const topics = ref([])
let firstMessageSaved = false

const messages = ref([])
const newMessage = ref("")
const inputRef = ref(null)
const messagesContainer = ref(null)
const autoScroll = ref(true)

const checkScrollPosition = () => {
  const el = messagesContainer.value
  if (!el) return


  const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
  autoScroll.value = isAtBottom
}

const scrollToBottom = () => {
  nextTick(() => {
    if (autoScroll.value && messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const pushAiMessageTyping = async (fullText) => {
  let displayed = ''
  messages.value.push({
    role: 'assistant',
    content: displayed,
    time: new Date().toLocaleTimeString()
  })

  const lastIndex = messages.value.length - 1
  for (let i = 0; i < fullText.length; i++) {
    displayed += fullText[i]
    messages.value[lastIndex].content = displayed
    await new Promise(r => setTimeout(r, 10))
    scrollToBottom()

    messages.value[lastIndex].content = fullText
  }
}

onMounted(() => {
  if (route.name === "NewChat") {
    messages.value = []
    firstMessageSaved = false
  }



})


watch(topics, (val) => {
  localStorage.setItem("topics", JSON.stringify(val))
}, {deep: true})


const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const message = newMessage.value

  if (!firstMessageSaved) {
    topics.value.unshift({
      id: Date.now(),
      title: message.slice(0, 20) || "New Chat"

    })

    firstMessageSaved = true
  }


  messages.value.push({
    role: 'user',
    content: message,
  })


  newMessage.value = ""
  inputRef.value?.focus()
  scrollToBottom()

  console.log(messages.value);
  // return 0;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: messages.value.map((message) => {
        return {
          role: message.role,
          content: message.content
        }
      })
    })

    const response = completion.choices[0].message.content
    await pushAiMessageTyping(response)

  } catch (err) {
    console.error("API Error:", err)
    await pushAiMessageTyping("error")
  }
}


</script>

<template>

  <div class="h-full min-h-screen w-full bg-neutral-700 flex flex-col items-end justify-center p-5">
  <!-- message box -->
  <div ref="messagesContainer"
       class="md:max-w-4xl w-full pt-35 pb-2 md:mx-auto overflow-y-auto h-[80vh] scroll-smooth"
       @scroll="checkScrollPosition">
    <div v-for="(msg, index) in messages" :key="index">
      <senderMsg v-if="msg.role === 'user'" :text="msg.content" :time="msg.time"/>
      <aiMsg v-else :text="msg.content" :time="msg.time"/>
    </div>

  </div>
  <!-- inputBox -->
  <div class="md:m-left-5 fixed bottom-5 px-5 bg-neutral-800 rounded-full border
         border-neutral-600 shadow-2xl p-3 flex items-center transition-all
         duration-200 hover:shadow-3xl left-0 right-0 mx-4 md:mx-auto md:w-[1000px]">

    <button
        class="text-white text-xl cursor-pointer hover:bg-neutral-700 bg-neutral-800 flex items-center justify-center rounded-full h-10 w-10 px-1">
      <svg class="w-6 h-6 text-neutral-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
           width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 12h14m-7 7V5"/>
      </svg>
    </button>

    <input v-model="newMessage" type="text" placeholder="Ask anything"
           class="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-full
             focus:outline-none focus:ring-0 border-none font-bold" ref="inputRef" @keyup.enter="sendMessage"/>

    <button class="text-white text-xl cursor-pointer bg-neutral-800 flex items-center
             justify-center rounded-full h-10 w-10 px-1 hover:bg-neutral-700"
            @click="sendMessage">
      <svg class="w-6 h-6 text-neutral-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
           width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2M12 4v12m0-12 4 4m-4-4L8 8"/>
      </svg>
    </button>
  </div>
  </div>
</template>
<style>
[scrollbar-width="none"] {
  scrollbar-width: none;
}


::-webkit-scrollbar {
  display: none;
}
</style>