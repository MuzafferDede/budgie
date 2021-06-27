export default {
    state: {
        contacts: {},
        requests: {}
    },
    getters: {},
    mutations: {
        SET_USER(state, payload) {
            state.name = payload.name
            state.id = payload.id
        },
        ADD_CONTACT(state, payload) {
            state.contacts[payload.id] = payload;
        },
        ADD_REQUEST(state, payload) {
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