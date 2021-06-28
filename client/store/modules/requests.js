export default {
    namespaced: true,
    state: () => { },
    getters: {
        requests: state => {
            return state
        }
    },
    mutations: {
        ADD(state, payload) {
            state.items = state.items || []

            state.items = state.items.filter(item => item.id !== payload.id)

            state.items.push(payload)
        },
        REMOVE(state, payload) {
            state.items = (state.items || []).filter(item => item.id !== payload.id)
        },
        REMOVE_ALL(state) {
            delete state.items
        },
    },
    actions: {
        save({ commit }, data) {
            commit('ADD', data)
        },
        delete({ commit }, data) {
            commit('REMOVE', data)
        },
        deleteAll({ commit }) {
            commit('REMOVE_ALL')
        },
    }
}