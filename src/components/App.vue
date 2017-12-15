<style src="../css/index.css">
</style>

<template>
  <section class="todoapp">
    <!-- nav -->
    <div class="navBar">
      <mt-header title="Todos">
        <mt-button slot="right" @click="goSetting">
          <img src="../assets/set.png" height="20" width="20" slot="icon">
        </mt-button>
      </mt-header>
    </div>
    <!-- header -->
    <header class="header">
      <!--  autofocus-->
      <input class="new-todo"
             id="new-todo-input"
             autocomplete="off"
             placeholder="Type new todo here"
             @keyup.enter="addTodo"
      >
    </header>
    <!-- main section -->
    <section id="main" ref="main" class="main" v-show="todos.length" >
      <!--<ul class="todo-list" v-for="(todo , index) in filteredTodos">
        <todo :key="index" :todo="todo"></todo>
      </ul>-->
      <draggable v-model="filteredTodos" @start="moveStart" @end="moveEnd" :options="{disabled: disabled}">
        <ul class="todo-list" v-for="(todo , index) in filteredTodos">
          <!--<todo :key="index" :todo="todo" class="todo" :class="{'isCompleted':todo.done}"></todo>-->
          <swipeout>
            <!--完全打开和关闭的事件  @on-open="handleEvents('on-open')"-->
            <swipeout-item transition-mode="follow" ref="swipeoutItem" @on-open="swipeoutStart(index)">
              <div slot="right-menu">
                <swipeout-button @click.native="setTodoLevel(todo,4)" style="background-color:tomato;color:black;">
                  instant
                </swipeout-button>
                <swipeout-button @click.native="setTodoLevel(todo,3)" style="background-color:chartreuse;color:blue;">
                  urgent
                </swipeout-button>
                <swipeout-button @click.native="setTodoLevel(todo,2)" style="background-color:aqua;color:indianred;">
                  important
                </swipeout-button>
              </div>
              <div slot="content" class="demo-content vux-1px-t"
                   :class="{'bg-tomato':todo.level==4,'bg-chartreuse':todo.level==3,'bg-aqua':todo.level==2}">
                <todo :index="index" :todo="todo" class="todo" :class="{'isCompleted':todo.done}"
                      @sonAction="goTodoDetail"></todo>
              </div>
            </swipeout-item>
          </swipeout>
        </ul>
      </draggable>
    </section>
    <!-- footer -->
    <footer class="row footer padding0" v-show="todos.length">
      <div class="col col-10 heightCenter">
        <input class="toggle-all" id="toggle-all"
               type="checkbox"
               :checked="allChecked"
               @change="toggleAll({ done: !allChecked })">
        <label for="toggle-all"></label>
      </div>
      <div class="col col-10 heightCenter">
        <span class="sort" @click="sort" :class="{'sortActive':!disabled}">sort</span>
      </div>
      <div class="col col-60 " style="display: grid;">
        <div class="row padding0" style="justify-content: center;align-items: center;">
          <strong>{{ remaining }}</strong> &nbsp {{ remaining | pluralize('item') }} left
        </div>
        <ul class="row filters" style="justify-content: center;">
          <li v-for="(val, key) in filters">
            <!--:href="'#/' + key"  加入路由导致不能用href 反正也不需要 删掉-->
            <a
              :class="{ selected: visibility === key }"
              @click="visibility = key">{{ key | capitalize }}</a>
          </li>
        </ul>
      </div>
      <div class="col col-10">
      </div>
      <div class="col col-10 heightCenter">
        <img class="clear-completed"
             src="../assets/delete.png"
             v-show="todos.length > remaining"
             @click="clearCompleted"/>
      </div>
    </footer>
  </section>
</template>

<script>
  import {mapMutations} from 'vuex'
  import Todo from './Todo.vue'
  /*拖拽组件*/
  import draggable from 'vuedraggable'

  /*提示组件*/
  import {MessageBox,Toast} from 'mint-ui';

  import {Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'


  const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => !todo.done),
    completed: todos => todos.filter(todo => todo.done)
  }

  export default {
    components: {Todo, draggable, Swipeout, SwipeoutItem, SwipeoutButton},
    data() {
      return {
        visibility: 'all',
        filters: filters,
        disabled: true,
        rightButtons: ''
      }
    },
    computed: {
      todos() {
        return this.$store.state.todos
      },
      allChecked() {
        return this.todos.every(todo => todo.done)
      },
      filteredTodos() {
        return filters[this.visibility](this.todos)
      },
      remaining() {
        return this.todos.filter(todo => !todo.done).length
      }
    },
    methods: {
      /*解决拖拽和滑动都需要列表支持的冲突，在每个滑块滑动最初将其他滑块关闭*/
      swipeoutStart(key){
        let swipeoutList = this.$refs.swipeoutItem;
        swipeoutList.forEach((swipeoutItem,index)=>{
          if(index != key && swipeoutItem.isOpen){
            swipeoutItem.close();
          }
        })
      },
      /*关闭所有滑块*/
      closeAllSwipeoutItem(){
        let swipeoutList = this.$refs.swipeoutItem;
        swipeoutList.forEach((swipeoutItem,index)=>{
            if(swipeoutItem.isOpen){
              swipeoutItem.close();
            }
        })
      },
      onButtonClick(todo, level) {
        this.setTodoLevel(todo, level);
      },
      goTodoDetail(todo, index) {
        this.$router.push({name: 'TodoDetail', params: {todo: todo, index: index}});
      },
      goSetting() {
        this.$router.push('/Setting')
      },
      sort() {
        this.disabled = !this.disabled;
      },
      moveStart(evt) {
        /*拖拽的时候先把所有滑块关闭*/
        this.closeAllSwipeoutItem();
      },
      moveEnd(evt) {
        this.moveTodo(evt);
      },
      addTodo(e) {
        var text = e.target.value;
        var self = this;
        if (text.trim()) {
          //this.$store.commit('addTodo', {text})
          this.$store.dispatch('addTodo', {text})
            .then(() => {
              e.target.blur();
              /*自动滚动*/
              self.$nextTick(() => document.getElementById("main").scrollTo(0, document.getElementById("main").scrollHeight));
              Toast({
                message: 'Add Success',
                position: 'bottom',
                duration: 1000
              });
            })
        }
        e.target.value = ''
      },
      setTodoLevel(todo, level) {
        this.$store.dispatch('setTodoLevel', {todo, level});
      },
      moveTodo(evt) {
        this.$store.commit('moveTodo', {evt})
      },
      clearCompleted() {
        MessageBox({
          title: 'warning',
          message: 'Clear and Never see again?',
          showCancelButton: true,
          cancelButtonText: 'no',
          confirmButtonText: 'yes'
        }).then(action => {
          if (action == 'confirm') {
            this.$store.commit('clearCompleted');
          }
        });
      },
      ...mapMutations([
        'toggleAll'
      ])
    },
    filters: {
      pluralize: (n, w) => n === 1 ? w : (w + 's'),
      capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
    },
    /*created与mounted的区别在于，请看vue生命周期，created只是创建一个vue实例，数据已经处理，但是dom还没有渲染，而mounted是dom节点已经挂载*/
    created() {
    },
    mounted(){
      /*挂载节点后计算main高度*/
      this.$nextTick(()=>{
        this.$refs.main.style.height =
          screen.height * 0.8 - 40 - 14 + 'px';
      })
    }
  }
</script>
