export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        all: state => state.items,
        unseen: state => state.items.filter(item => !item.seen),
    },
    mutations: {
        ADD_NOTIFICATION(state, payload) {
            state.items.push(payload)
        },
        REMOVE_NOTIFICATION(state, payload) {
            state.items = state.items.filter(item => item.data !== payload.data)
        },
        REMOVE_ALL_NOTIFICATIONS(state) {
            state.items = []
        },
        READ_ALL_NOTIFICATIONS(state) {
            state.items.map(item => {
                item.seen = true;
                return item;
            })
        },
    },
    actions: {
        addNotification({ commit, dispatch }, data) {
            // remove if this notification its with data exists previously
            dispatch('removeNotification', data)

            // add new notification
            commit('ADD_NOTIFICATION', data)
        },
        removeNotification({ commit }, data) {
            // remove notification
            commit('REMOVE_NOTIFICATION', data)
        },
        removeAllNotifications({ commit }) {
            // remove all notifications
            commit('REMOVE_ALL_NOTIFICATIONS')
        },
        readAllNotifications({ commit }) {
            // read all notifications
            commit('READ_ALL_NOTIFICATIONS')
        },
    }
}