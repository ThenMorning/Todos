import './assets/fonts/iconfont.css';

import Vue from 'vue'
import store from './store'
import FastClick from 'fastclick'
/*FastClick.attach(document.body);*/
import Home from './components/Home.vue'
import App from './components/App.vue'
import TodoDetail from './components/TodoDetail.vue'
import Setting from './components/Setting.vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import 'mint-ui/lib/style.css'

import { Header } from 'mint-ui';
Vue.component(Header.name, Header);

import { Button } from 'mint-ui';
Vue.component(Button.name, Button);


import VueCordova from 'vue-cordova'
Vue.use(VueCordova);

// 去除浏览器提示
Vue.config.productionTip = false;

//星星组件
import VueStar from 'vue-star'
Vue.component('VueStar', VueStar)

/*
import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.rem/accordion';
*/
import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.px/accordion';
Vue.component(Accordion.name, Accordion);
Vue.component(AccordionItem.name, AccordionItem);


const routes = [
  { path: '/',name:'App', component: App },
  { path: '/TodoDetail/:todo/:index',name:'TodoDetail', component: TodoDetail },
  { path: '/Setting',name:'Setting', component: Setting }
];

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
});


new Vue({
  store, // inject store to all children
  router,
  el: '#app',
  render: h => h(Home)
});
