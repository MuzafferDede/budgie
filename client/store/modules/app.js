export default {
    namespaced: true,
    state: {
        alert: undefined,
        event: undefined,
        panel: undefined,
        call: {}
    },
    getters: {
        alert: state => state.alert,
        event: state => state.event,
        call: state => state.call,
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
        SET_CALL(state, payload) {
            state.call = payload
        },
        SET_CALL_PROP(state, { key, value }) {
            state.call[key] = value
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
        setCall({ commit }, data) {
            commit('SET_CALL', data)
        },
        setCallProp({ commit }, data) {
            commit('SET_CALL_PROP', data)
        },
    }
}