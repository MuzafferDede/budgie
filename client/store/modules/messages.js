export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        all: state => {
            return state.items
        },
        current: (state) => (user, contact) => {
            return state.items.filter(
                message => {
                    return (message.sender === contact &&
                        message.receiver === user) ||
                        (message.sender === user &&
                            message.receiver === contact)
                }

            );
        }
    },
    mutations: {
        ADD_MESSAGE(state, payload) {
            state.items.push(payload)
        },
        REMOVE_CONTACT_MESSAGE(state, payload) {
            state.items = state.items.filter(message => message.sender === payload)
        },
        REMOVE_ALL_MESSAGES(state) {
            delete state.items
        },
        SET_MESSAGE_STATUS(state, payload) {
            state.items.map(message => {
                if (message.sender === payload) {
                    delete message.new
                }
            })
        },
    },
    actions: {
        addMessage({ commit }, data) {
            commit('ADD_MESSAGE', data)
        },
        removeContactMessage({ commit }, data) {
            commit('REMOVE_CONTACT_MESSAGE', data)
        },
        removeAllMessages({ commit }) {
            commit('REMOVE_ALL_MESSAGES')
        },
        setMessageStatus({ commit }, data) {
            commit('SET_MESSAGE_STATUS', data)
        },
    }
}