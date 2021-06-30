export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        all: state => {
            return state.items
        }
    },
    mutations: {
        ADD_REQUEST(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)

            state.items.push(payload)
        },
        REMOVE_REQUEST(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)
        },
        REMOVE_ALL_REQUESTS(state) {
            delete state.items
        },
    },
    actions: {
        addRequest({ commit }, data) {
            commit('ADD_REQUEST', data)
        },
        removeRequest({ commit }, data) {
            commit('REMOVE_REQUEST', data)
        },
        removeAllRequests({ commit }) {
            commit('REMOVE_ALL_REQUESTS')
        },
    }
}