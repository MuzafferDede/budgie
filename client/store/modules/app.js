export default {
    namespaced: true,
    state: {
        alert: undefined,
        event: undefined,
        panel: undefined,
    },
    getters: {
        alert: state => state.alert,
        event: state => state.event,
        panel: state => state.panel,
    },
    mutations: {
        SET_ALERT(state, payload) {
            state.alert = payload
        },
        SET_EVENT(state, payload) {
            state.event = payload
        },
        SET_PANEL(state, payload) {
            state.panel = state.panel === payload ? undefined : payload
        },
    },
    actions: {
        setAlert({ commit }, data) {
            commit('SET_ALERT', data)
        },
        setEvent({ commit }, data) {
            commit('SET_EVENT', data)
        },
        setPanel({ commit }, data) {
            commit('SET_PANEL', data)
        },
    }
}