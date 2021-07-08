export default {
    computed: {
        event() {
            return this.$store.getters["app/event"];
        },
    },
    methods: {
        $log(message) {
            console.log(message)
        }
    },
    watch: {
        event(event) {
            if (this[event.name]) {
                this[event.name]();
            }
        },
    },
}