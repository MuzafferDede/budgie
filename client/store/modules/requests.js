export default {
    namespaced: true,
    state: () => {},
    getters: {
        requests: state => {
            return state
        }
    },
    mutations: {
        ADD(state, payload) {
            state.items = state.items || [];

            const request = state.items.find(item => item.id === payload.id)
            if(!request && payload) {
                state.items.push(payload)
            }
        },
        REMOVE(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)
        },
    },
    actions: {
        save({ commit }, data) {
            commit('ADD', data)
        },
        delete({ commit }, data) {
            commit('REMOVE', data)
        },
    }
}