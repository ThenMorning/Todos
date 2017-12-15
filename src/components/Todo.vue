<template>
  <li class="todo" :class="{ completed: todo.done, editing: editing }">
    <div class="view" @click="fatherAction(todo,index)">
      <input class="toggle"
        type="checkbox"
        :checked="todo.done"
        @change="toggleTodo({ todo: todo })">
        <label v-text="todo.text" @dblclick="editing = true"></label>
        <span>begin at {{beginTime}}</span>
<!--
      <span>complete at {{todo.completeTime}}</span>
-->
<!--      <span>{{todo.level}}</span>-->
<!--
      <button class="destroy" @click="deleteTodo({ todo: todo })"></button>
-->
      <!--tomato,chartreuse,aqua-->
    </div>
    <input class="edit"
      v-show="editing"
      v-focus="editing"
      :value="todo.text"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit">
  </li>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Todo',
  props: ['todo','index'],
  data () {
    return {
      editing: false,
      beginTime:''
    }
  },
  directives: {
    focus (el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  methods: {
    ...mapMutations([
      'editTodo',
      'toggleTodo',
      'deleteTodo'
    ]),
    fatherAction(todo,index){
      if(event.target.localName != 'input'){
        this.$emit('sonAction',todo,index);
      }
    },
    doneEdit (e) {
      const value = e.target.value.trim()
      const { todo } = this
      if (!value) {
        this.deleteTodo({
          todo
        })
      } else if (this.editing) {
        this.editTodo({
          todo,
          value
        })
        this.editing = false
      }
    },
    cancelEdit (e) {
      e.target.value = this.todo.text
      this.editing = false
    }
  },
  created(){
    this.beginTime = this.todo.beginTime;
    this.beginTime = new Date(this.beginTime).toLocaleString()
  }
}
</script>
