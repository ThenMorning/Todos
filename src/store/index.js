import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations } from './mutations'

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions: {
    addTodo: ({commit},text) => commit('addTodo',text),
    setTodoLevel:({commit},{todo,level}) => commit('setTodoLevel',{todo,level}),
    addTodoComment:({commit},{todo,commentContent}) => commit('addTodoComment',{todo,commentContent})
  }
})
