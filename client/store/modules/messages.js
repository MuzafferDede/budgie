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
        },
        last: (state) => (user, contact) => {
            const items = state.items.filter(
                message => {
                    return (message.sender === contact &&
                        message.receiver === user) ||
                        (message.sender === user &&
                            message.receiver === contact)
                }

            );

            return items[items.length - 1];
        },
        new: (state) => (contact) => {
            return state.items
                .filter((message) => message.sender === contact.id)
                .reduce((current, message) => {
                    if (message.new) current++;
                    return current;
                }, 0);
        }
    },
    mutations: {
        ADD_MESSAGE(state, payload) {
            state.items.push(payload)
        },
        REMOVE_CONTACT_MESSAGES(state, payload) {
            state.items = state.items.filter(message => message.sender === payload)
        },
        REMOVE_ALL_MESSAGES(state) {
            delete state.items
        },
        SET_MESSAGE_STATUS(state, payload) {
            if(payload) {
                state.items.map(message => {
                    if (message.sender === payload.id) {
                        delete message.new
                    }
                })
            }

        },
    },
    actions: {
        addMessage({ commit }, data) {
            commit('ADD_MESSAGE', data)
        },
        removeContactMessages({ commit }, data) {
            commit('REMOVE_CONTACT_MESSAGES', data)
        },
        removeAllMessages({ commit }) {
            commit('REMOVE_ALL_MESSAGES')
        },
        setMessageStatus({ commit }, data) {
            commit('SET_MESSAGE_STATUS', data)
        },
    }
}