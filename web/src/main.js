import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css';
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAUi994gsIjnNfCJa-6EWTinA2V0ATPvzs',
    libraries: 'drawing', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
  autobindAllEvents: true
 
  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,
 
  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

import {
  Form,
  FormModel,
  Input,
  Button,
  Icon,
  Col,
  Row,
  Modal,
  Popconfirm,
  message
} from 'ant-design-vue'

Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;
Vue.config.productionTip = false

Vue.use(Popconfirm)
Vue.use(Modal)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Input)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Col)
Vue.use(Row)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
