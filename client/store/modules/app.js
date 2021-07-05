export default {
    namespaced: true,
    state: {
        alert: undefined,
        event: undefined,
        panel: undefined,
        onCall: {}
    },
    getters: {
        alert: state => state.alert,
        event: state => state.event,
        onCall: state => state.onCall,
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
        SET_ON_CALL(state, payload) {
            state.onCall = { ...state.onCall, ...payload }
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
        setOnCall({ commit }, data) {
            commit('SET_ON_CALL', data)
        },
    }
}