export default {
    namespaced: true,
    state: {
        alert: undefined,
        callTriger: undefined,
        event: undefined,
        offer: undefined,
        panel: undefined,
    },
    getters: {
        alert: state => state.alert,
        callTriger: state => state.callTriger,
        event: state => state.event,
        offer: state => state.offer,
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
        SET_CALL_TRIGER(state, payload) {
            state.callTriger = payload
        },
        SET_OFFER(state, payload) {
            state.offer = payload
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
        setVideoCall({ commit, dispatch }) {
            dispatch('setPanel', 'Call').then(() => {
                commit('SET_CALL_TRIGER', 'videoCall')
            }).then(() => {
                commit('SET_CALL_TRIGER', undefined)
            })
        },
        setAudioCall({ commit, dispatch }) {
            dispatch('setPanel', 'Call').then(() => {
                commit('SET_CALL_TRIGER', 'audioCall')
            }).then(() => {
                commit('SET_CALL_TRIGER', undefined)
            })
        },
        setOffer({ commit }, data) {
            commit('SET_OFFER', data)
        },
    }
}