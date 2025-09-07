<script setup>
import { ref, nextTick, onMounted, watch } from 'vue';
import senderMsg from "../components/senderMsg.vue";
import aiMsg from "../components/aiMsg.vue";
import OpenAI from 'openai';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({ id: { type: String } });


const theme = ref('dark');
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
};




const topics = ref(JSON.parse(localStorage.getItem('topics') || '[]'));
const chat = ref(null);
const messages = ref([]);
const newMessage = ref('');
const inputRef = ref(null);
const messagesContainer = ref(null);
const autoScroll = ref(true);


const saveTopics = () => {
  localStorage.setItem('topics', JSON.stringify(topics.value));
};

const loadChat = () => {

  topics.value = JSON.parse(localStorage.getItem('topics') || '[]');
  chat.value = topics.value.find(t => String(t.id) === String(props.id));
  if (chat.value && Array.isArray(chat.value.messages)) {
    messages.value = [...chat.value.messages];
  } else {
    messages.value = [];
  }
};


onMounted(() => {
  loadChat();

  window.addEventListener('storage', (e) => {
    if (e.key === 'topics') {
      topics.value = JSON.parse(e.newValue || '[]');
      loadChat();
    }
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) theme.value = savedTheme;
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
});

watch(() => props.id, () => {
  loadChat();
});

watch(messages, (newMessages) => {
  if (!chat.value) return;

  const idx = topics.value.findIndex(t => String(t.id) === String(chat.value.id));
  if (idx !== -1) {
    topics.value[idx].messages = newMessages;
  } else {

    topics.value.unshift({
      id: chat.value.id,
      title: chat.value.title || 'New Chat',
      messages: newMessages
    });
  }
  saveTopics();
}, { deep: true });

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  baseURL: 'https://ai.liara.ir/api/v1/68809a637c37ffa36a7c85ec',
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDdjNTUwYmQ1YzIwYTVlYThiODE0YzgiLCJ0eXBlIjoiYXV0aCIsImlhdCI6MTc1NTQxNDM5OH0.YsgaA3lhuOjbidVVrM3lJonfzmHO05cIbp2uHHgiJh0',
});

const scrollToBottom = () => {
  nextTick(() => {
    if (autoScroll.value && messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const checkScrollPosition = () => {
  const el = messagesContainer.value;
  if (!el) return;
  autoScroll.value = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
};

const pushAiMessageTyping = async (fullText) => {
  let displayed = '';
  messages.value.push({
    role: 'assistant',
    content: displayed,
    time: new Date().toLocaleTimeString()
  });
  const lastIndex = messages.value.length - 1;
  for (let i = 0; i < fullText.length; i++) {
    displayed += fullText[i];
    messages.value[lastIndex].content = displayed;
    await new Promise(r => setTimeout(r, 10));
    scrollToBottom();
  }

  messages.value[lastIndex].content = fullText;
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  const message = newMessage.value.trim();


  if (!chat.value) {
    const newChat = {
      id: props.id || Date.now().toString(),
      title: message.slice(0, 20) || 'New Chat',
      messages: []
    };
    topics.value.unshift(newChat);
    chat.value = newChat;
    saveTopics();
  }


  messages.value.push({
    role: 'user',
    content: message,
    time: new Date().toLocaleTimeString()
  });

  newMessage.value = '';
  inputRef.value?.focus();
  scrollToBottom();

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: messages.value.map(m => ({ role: m.role, content: m.content }))
    });
    const response = completion.choices[0].message.content;
    await pushAiMessageTyping(response);
  } catch (err) {
    console.error('API Error:', err);
    await pushAiMessageTyping('error ');
  }
};
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
    <div
        class="md:m-left-5 fixed bottom-5 px-5 bg-neutral-800 rounded-full border
         border-neutral-600 shadow-2xl p-3 flex items-center transition-all
         duration-200 hover:shadow-3xl left-0 right-0 mx-4 md:mx-auto md:w-[1000px]"
    >
      <button @click="toggleTheme" class="text-white bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center rounded-full h-10 w-10 mr-2">
        <span v-if="theme==='light'">🌙</span>
        <span v-else>☀️</span>
      </button>

      <input
          v-model="newMessage"
          type="text"
          placeholder="Ask anything"
          class="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-0 border-none font-bold"
          ref="inputRef"
          @keyup.enter="sendMessage"
      />

      <button
          class="text-white text-xl cursor-pointer bg-neutral-800 flex items-center justify-center rounded-full h-10 w-10 px-1 hover:bg-neutral-700"
          @click="sendMessage"
          type="button"
      >
        <svg class="w-6 h-6 text-neutral-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2M12 4v12m0-12 4 4m-4-4L8 8"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style>
[scrollbar-width="none"] { scrollbar-width: none; }
::-webkit-scrollbar { display: none; }

.light { background-color: #f9fafb; color: #404040; }
.dark { background-color: #404040; color: #f9fafb; }
::-webkit-scrollbar { display: none; }

</style>
