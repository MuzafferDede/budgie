export default {
    namespaced: true,
    state: () => { },
    getters: {
        contacts: state => {
            return state
        }
    },
    mutations: {
        ADD(state, payload) {
            state.items = state.items || [];

            const contact = state.items.find(item => item.id === payload.id)

            if(!contact && payload) {
                state.items.push(payload)
            }
        },
        REMOVE(state, payload) {
            state.items = state.items.filter(item => item.id !== payload.id)
        },
        CHANGE_STATUS(state, payload) {
            const contact = state.items.find(item => item.id === payload.id)
            
            if(!contact) {
                contact.online = payload;
            }
        },
    },
    actions: {
        save({ commit }, data) {
            commit('ADD', data)
        },
        delete({ commit }, data) {
            commit('REMOVE', data)
        },
        setStatus({ commit }, data) {
            commit('CHANGE_STATUS', data)
        },
    }
}