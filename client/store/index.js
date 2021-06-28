import { createStore } from 'vuex'
import client from './modules/client'
import contacts from './modules/contacts'
import requests from './modules/requests'
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    modules: {
        client,
        contacts,
        requests,
    },
    plugins: [createPersistedState()],
})

export default store