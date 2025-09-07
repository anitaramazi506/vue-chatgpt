<script setup>

import {onMounted, onUpdated, ref} from 'vue';
import senderMsg from "../components/senderMsg.vue";
import aiMsg from "../components/aiMsg.vue";

import OpenAI from 'openai';
import {useRouter, useRoute} from 'vue-router'

const router = useRouter()


const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  baseURL: 'https://ai.liara.ir/api/v1/68809a637c37ffa36a7c85ec',
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDdjNTUwYmQ1YzIwYTVlYThiODE0YzgiLCJ0eXBlIjoiYXV0aCIsImlhdCI6MTc1NTQxNDM5OH0.YsgaA3lhuOjbidVVrM3lJonfzmHO05cIbp2uHHgiJh0',
});


const newMessage = ref("")
const messages = ref([])


const theme = ref('dark');
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
};

onMounted(() => {

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) theme.value = savedTheme;
  document.documentElement.classList.toggle('dark', theme.value === 'dark');

})


const createChat = async () => {

  if (!newMessage.value.trim()) return

  const message = newMessage.value

  newMessage.value = ""


  try {
    messages.value.push(
        {
          role: 'user',
          content: message,
          time: new Date().toLocaleTimeString()
        }
    )

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: message,
        }
      ]
    })



    const response = completion.choices[0].message.content;
    let topic = {
      id: Date.now(),
      title: message.slice(0, 20) || "New Chat",
    }
    let storage = JSON.parse(localStorage.getItem('topics')) ?? [];
    messages.value.push(
        {
          role: 'assistant',
          content: response,
          time: new Date().toLocaleTimeString()
        }
    );
    storage.unshift({
      ...topic,
      messages: messages.value
    });


    localStorage.setItem("topics", JSON.stringify(storage));
    router.push({name: 'chat', params: {id: topic.id}});
  } catch (err) {
    console.error("API Error:", err)
    await pushAiMessageTyping("error")
  }

}


</script>

<template>
  <div :class="[theme, 'h-full min-h-screen w-full flex flex-col items-end justify-center p-5']">
    <!-- message box -->

    <div
        ref="messagesContainer"
        class="md:max-w-4xl w-full pt-35 pb-2 md:mx-auto overflow-y-auto h-[80vh] scroll-smooth"
        @scroll="checkScrollPosition"
    >
      <div v-for="(msg, index) in messages" :key="index">
        <senderMsg v-if="msg.role === 'user'" :text="msg.content" :time="msg.time"/>
        <aiMsg v-else :text="msg.content" :time="msg.time"/>
      </div>
      <div v-if="messages.length === 0" class="text-center text-neutral-400 py-4">
        no message
      </div>
    </div>

    <!-- inputBox -->
    <div class="md:m-left-5 fixed bottom-5 px-5 bg-neutral-800 rounded-full border
         border-neutral-600 shadow-2xl p-3 flex items-center transition-all
         duration-200 hover:shadow-3xl left-0 right-0 mx-4 md:mx-auto md:w-[1000px]">

      <button @click="toggleTheme"
              class="text-white bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center rounded-full h-10 w-10 mr-2">
        <span v-if="theme==='light'">🌙</span>
        <span v-else>☀️</span>
      </button>

      <input v-model="newMessage" type="text" placeholder="Ask anything"
             class="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-full
             focus:outline-none focus:ring-0 border-none font-bold" ref="inputRef" @keyup.enter="createChat"/>

      <button @click="createChat" class="text-white text-xl cursor-pointer bg-neutral-800 flex items-center
             justify-center rounded-full h-10 w-10 px-1 hover:bg-neutral-700"
      >
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

</style>