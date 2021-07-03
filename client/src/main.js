import { createApp } from 'vue'
import App from './App.vue'
import store from '../store'
import common from './mixins/common';

createApp(App).mixin(common).use(store).mount('#app')
