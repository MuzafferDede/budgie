import { createStore } from 'vuex'
import app from './modules/app'
import client from './modules/client'
import contacts from './modules/contacts'
import notifications from './modules/notifications'
import messages from './modules/messages'
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    modules: {
        app,
        client,
        contacts,
        messages,
        notifications
    },
    plugins: [createPersistedState()],
})

export default store