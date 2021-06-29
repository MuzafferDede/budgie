export default {
    namespaced: true,
    state: () => { },
    getters: {
        user: state => {
            return state
        }
    },
    mutations: {
        SET(state, payload) {
            state.id = payload.id
            state.name = payload.name
        },
        DELETE(state) {
            delete state.name
            delete state.id
        },
        CHANGE_VISION(state, payload) {
            state.vision = payload
        },
    },
    actions: {
        save({ commit }, data) {
            commit('SET', data)
        },
        delete({ commit }) {
            commit('DELETE')
        },
        setVision({ commit }, data) {
            commit('CHANGE_VISION', data)
        },
    }
}