import {createRouter, createWebHistory} from 'vue-router'
import NewChat from '../views/NewChat.vue'
import Chat from '../views/Chat.vue'
import About from "../views/About.vue";


const routes = [
    {
        path: '/',
        name: 'home',
        component: About
    }, {
        path: '/chat',
        name: 'new_chat',
        component: NewChat
    },
    {
        path: '/chat/:id',
        name: 'chat',
        component: Chat,
        props: true
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    if (to.name === 'home') {
        // redirect the user to the login page
        return { name: 'new_chat' }
    }
})

export default router
