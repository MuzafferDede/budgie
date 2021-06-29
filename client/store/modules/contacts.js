export default {
    namespaced: true,
    state: () => { },
    getters: {
        contacts: state => {
            return state
        },
        contact: state => {
            return state.current
        },
    },
    mutations: {
        ADD_CONTACT(state, payload) {

            state.items = (state.items || []).filter(item => item.id !== payload.id)

            state.items.push(payload)
        },
        REMOVE_CONTACT(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)
        },
        REMOVE_ALL_CONTACTS(state) {
            delete state.items
        },
        SET_CONTACT_STATUS(state, payload) {
            const contact = (state.items || []).find(item => item.id === payload.id)

            if (!contact) {
                contact.online = payload;
            }
        },
        SET_CURRENT_CONTACT(state, payload) {

            const contact = (state.items || []).find(item => item.id === payload)

            state.current = contact
        },
    },
    actions: {
        addContact({ commit, dispatch }, data) {
            commit('ADD_CONTACT', data)

            dispatch("requests/removeRequest", data, { root: true })
        },
        removeContact({ commit, dispatch }, data) {
            commit('REMOVE_CONTACT', data)

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
    }
}