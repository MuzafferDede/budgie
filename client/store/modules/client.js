export default {
    namespaced: true,
    state: () => { },
    getters: {
        user: state => {
            return state
        }
    },
    mutations: {
        ADD_CLIENT(state, payload) {
            state.id = payload.id
            state.name = payload.name
        },
        DELETE(state) {
            delete state.name
            delete state.id
        },
    },
    actions: {
        addClient({ commit }, data) {
            commit('ADD_CLIENT', data)
        },
        removeClient({ commit }) {
            commit('REMOVE_CLIENT')
        },
    }
}