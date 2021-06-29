export default {
    namespaced: true,
    state: () => { },
    getters: {
        messages: state => {
            return state
        }
    },
    mutations: {
        ADD(state, payload) {
            state.items = state.items || []

            state.items.push(payload)
        },
        DELETE(state, payload) {
            state.items = (state.items || []).filter(message => message.sender === payload)
        },
        REMOVE_ALL(state) {
            delete state.items
        },
        SEEN(state, payload) {
            (state.items || []).map(message => {
                if (message.sender === payload) {
                    delete message.new
                }
            })
        },
    },
    actions: {
        save({ commit }, data) {
            commit('ADD', data)
        },
        read({ commit }, data) {
            commit('SEEN', data)
        },
        delete({ commit }, data) {
            commit('DELETE', data)
        },
        deleteAll({ commit }) {
            commit('REMOVE_ALL')
        },
    }
}