// store.js
import { reactive } from 'vue'

export const store = reactive({
    topics: JSON.parse(localStorage.getItem("topics") || "[]"),

    addTopic(title) {
        const id = Date.now().toString()
        this.topics.unshift({
            id,
            title: title.slice(0, 20) || "New Chat"
        })
        localStorage.setItem("topics", JSON.stringify(this.topics))
        return id
    }
})
