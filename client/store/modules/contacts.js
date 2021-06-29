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
        ADD(state, payload) {

            state.items = (state.items || []).filter(item => item.id !== payload.id)

            state.items.push(payload)
        },
        REMOVE(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)
        },
        REMOVE_ALL(state) {
            delete state.items
        },
        CHANGE_STATUS(state, payload) {
            const contact = (state.items || []).find(item => item.id === payload.id)

            if (!contact) {
                contact.online = payload;
            }
        },
        CHANGE_CONTACT(state, payload) {

            const contact = (state.items || []).find(item => item.id === payload)

            state.current = contact
        },
    },
    actions: {
        save({ commit, dispatch }, data) {
            commit('ADD', data)

            dispatch("requests/delete", data, { root: true })
        },
        delete({ commit, dispatch }, data) {
            commit('REMOVE', data)

            dispatch('messages/delete', data, { root: true })
        },
        deleteAll({ commit, dispatch }) {
            commit('REMOVE_ALL')

            dispatch('messages/deleteAll', null, { root: true })
        },
        setStatus({ commit }, data) {
            commit('CHANGE_STATUS', data)
        },
        setContact({ commit, dispatch }, data) {
            commit('CHANGE_CONTACT', data)

            dispatch('messages/read', data, { root: true })
        },
    }
}