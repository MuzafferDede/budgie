export default {
    state: () => {},
    getters: {},
    mutations: {
        SET_USER(state, payload) {
            state.name = payload.name
            state.id = payload.id
        },
        DELETE_USER(state) {
            delete state.name
            delete state.id
            delete state.contacts
            delete state.requests
        },
        ADD_CONTACT(state, payload) {
            if(!state.contacts) state.contacts = {}

            state.contacts[payload.id] = payload;
        },
        ADD_REQUEST(state, payload) {
            if(!state.requests) state.requests = {}

            state.requests[payload.id] = payload;
        },
        REMOVE_CONTACT(state, payload) {
            delete state.contacts[payload.id];
        },
        REMOVE_REQUEST(state, payload) {
            delete state.requests[payload.id];
        }
    },
    actions: {
        saveUser({ commit }, data) {
            commit('SET_USER', data)
        },
        deleteUser({ commit }) {
            commit('DELETE_USER')
        },
        saveContact({ commit }, data) {
            commit('ADD_CONTACT', data)
        },
        saveRequest({ commit }, data) {
            commit('ADD_REQUEST', data)
        },
        deleteContact({ commit }, data) {
            commit('REMOVE_CONTACT', data)
        },
        deleteRequest({ commit }, data) {
            commit('REMOVE_REQUEST', data)
        },
    }
}