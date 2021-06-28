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
        CHANGE_CONVERSATION(state, payload) {
            state.contact = payload
        },
    },
    actions: {
        save({ commit }, data) {
            commit('SET', data)
        },
        delete({ commit }) {
            commit('DELETE')
            
            commit('CHANGE_CONVERSATION', undefined)
        },
        setVision({ commit }, data) {
            commit('CHANGE_VISION', data)
        },
        setConversation({ commit, dispatch }, data) {
            commit('CHANGE_CONVERSATION', data)
            
            dispatch('messages/read', data, { root: true })
        },
    }
}