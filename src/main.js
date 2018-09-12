import Vue from 'vue'
import App from './App.vue'
import './../node_modules/bulma/css/bulma.min.css';

Vue.config.productionTip = false

Vue.directive('errorCheck', {
  componentUpdated: function (el, binding, vnode) {
    let text = el.innerText;
    if(text.includes("NaN")) {
      if(!el.classList.contains("has-text-danger")) {
        el.classList.add("has-text-danger");
      }
      
    }
  },
  inserted(el, binding, vnode) {
    let text = el.innerText;
    if(text.includes("NaN")) {
      if(!el.classList.contains("has-text-danger")) {
        el.classList.add("has-text-danger");
      }
    }
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
