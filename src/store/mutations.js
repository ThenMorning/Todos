export const STORAGE_KEY = 'todos';

export const state = {
  todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
};

export const mutations = {
  addTodo(state, {text}) {
    state.todos.push({
      text,
      content:'',
      done: false,
      level: 1,
      beginTime: new Date(),
      completeTime: '',
      comments:[]
    });
    saveTodos();
  },

  moveTodo(state, {evt}) {
    var arr = state.todos;
    /*适用于同一个数组中的元素移动*/
    var moveTo = function (arr, index, tindex) {
      if (index > tindex) {
        arr.splice(tindex, 0, arr[index]);
        arr.splice(index + 1, 1)
      } else {
        arr.splice(tindex + 1, 0, arr[index]);
        arr.splice(index, 1)
      }
    };
    moveTo(arr, evt.oldIndex, evt.newIndex);
    saveTodos();
  },

  deleteTodo(state, {todo}) {
    state.todos.splice(state.todos.indexOf(todo), 1);
    saveTodos();
  },

  toggleTodo(state, {todo}) {
    todo.done = !todo.done;
    if (todo.done) {
      todo.completeTime = new Date();
    }
    else {
      todo.completeTime = '';
    }
    saveTodos();
  },

  setTodoLevel(state, {todo, level}) {
    todo.level = level;
    saveTodos();
  },

  editTodo(state, {todo, value}) {
    todo.text = value;
    saveTodos();
  },

  editTodoContent(state,{todo,content}){
    todo.content = content;
    saveTodos();
  },

  addTodoComment(state,{todo,commentContent}){
    let comment = {
      content:commentContent,
      createTime:new Date()
    }
    todo.comments.push(comment);
    saveTodos();
  },

  toggleAll(state, {done}) {
    state.todos.forEach((todo) => {
      todo.done = done;
      if (todo.done) {
        todo.completeTime = new Date();
      }
      else {
        todo.completeTime = '';
      }
    });
    saveTodos();
  },

  clearCompleted(state) {
    state.todos = state.todos.filter(todo => !todo.done);
    saveTodos();
  }

};

let saveTodos = function () {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
};
