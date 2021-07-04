import { $socket } from '../../src/utils'

export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        all: state => {
            return state.items
        },
        confirmed: state => {
            return state.items.filter(item => item.clientId && item.socketId)
        },
        contact: state => {
            return state.current
        },
    },
    mutations: {
        ADD_CONTACT(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)

            state.items.push(payload)
        },
        REMOVE_CONTACT(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)
        },
        REMOVE_ALL_CONTACTS(state) {
            state.items = []
        },
        SET_CONTACT_STATUS(state, payload) {
            const contact = state.items.find(item => item.id === payload.id)

            if (!contact) {
                contact.online = payload;
            }
        },
        SET_CURRENT_CONTACT(state, payload) {
            state.current = payload
        },
        ACCEPT_CONTACT_REQUEST(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)

            state.items.push(payload)

            $socket.emit('accept request', payload.id)
        },
    },
    actions: {
        addContact({ commit }, data) {
            commit('ADD_CONTACT', data)
        },
        removeContact({ commit, dispatch }, data) {
            commit('REMOVE_CONTACT', data)

            dispatch('setCurrentContact', undefined)

            dispatch('messages/removeContactMessages', data, { root: true })
        },
        removeAllContacts({ commit, dispatch }) {
            commit('REMOVE_ALL_CONTACTS')

            dispatch('messages/removeAllMessages', null, { root: true })
        },
        setCurrentContact({ commit, dispatch }, data) {
            commit('SET_CURRENT_CONTACT', data)

            dispatch('messages/setMessageStatus', data, { root: true })
        },
        setContactStatus({ commit }, data) {
            commit('SET_CONTACT_STATUS', data)
        },
        acceptContactRequest({ commit, dispatch }, data) {
            commit('ACCEPT_CONTACT_REQUEST', data)

            dispatch('notifications/removeNotification', data, { root: true })
        },
    }
}