/**
* Created with Winward.
* Date: 2017/12/5
* Time: 上午10:21
*
*/
<template>
  <section class="todoapp">
    <mt-header :title="todo.text" :fixed="true">
      <router-link to="/" slot="right">
        <mt-button>
          <img src="../assets/close.png" height="20" width="20" slot="icon">
        </mt-button>
      </router-link>
    </mt-header>
    <div class="detailMain" id="detailMain">
      <!--chart-->
      <div>
        <ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
      </div>
      <!--todo content-->
      <div>
        <group>
          <vue-star animate="animated bounceIn" ref="vueStar">
            <i slot="icon" class="iconfont icon-edit" :class="isReadonly ? 'balckIcon' : 'redIcon'"
               style="font-size: 23px;"
               @click="editClick"></i>
          </vue-star>
          <x-textarea title="todo"
                      inline-desc="content"
                      placeholder="type todo content here"
                      v-model="todoContent"
                      @on-blur="todoContentChange"
                      :readonly="isReadonly" autosize></x-textarea>
        </group>
      </div>
      <!--todo comments-->
      <div>
        <yd-accordion accordion>
          <yd-accordion-item title="todo comments" open>            
            <timeline>
              <timeline-item v-for="(comment, index) in todo.comments" :key="index">
                <p>{{new Date(comment.createTime).toLocaleString()}}</p>
                <h4 style="word-break: break-word;">{{comment.content}}</h4>
              </timeline-item>
            </timeline>           
          </yd-accordion-item>
        </yd-accordion>
      </div>
    </div>
    <!--todo footer commentArea-->
    <div class="commentArea" id="commentArea">
      <group>
        <i id="pushIcon" class="iconfont icon-xiaoxituisongshezhi" style="font-size: 50px;float: right"
           @click="addTodoComment"></i>
        <x-textarea id="commentTextArea"
                    ref="commentTextArea"
                    title=""
                    :rows="1"
                    :max="200"
                    @on-change="todoCommentChange"
                    inline-desc=""
                    placeholder="type todo comments here"
                    v-model="customNewComment" autosize></x-textarea>
      </group>
    </div>
  </section>
</template>
<script>
  import VeHistogram from 'v-charts/lib/histogram'
  import {XTextarea, Group} from 'vux'
  import {Timeline, TimelineItem} from 'vux'
  import {ViewBox} from 'vux'

  /*提示组件*/
  import {MessageBox,Toast} from 'mint-ui';

  export default {
    components: {
      VeHistogram, XTextarea, Group, Timeline, TimelineItem, ViewBox
    },
    data() {
      return {
        todo: Object,
        index: 0,
        isReadonly: true,
        todoContent: '',
        customNewComment: '',
        commentAreaOldHeight: 0
      }
    },
    watch: {},
    computed: {},
    methods: {
      addTodoComment() {
        if(this.customNewComment && this.customNewComment != ''){
          let todo = this.todo;
          let commentContent = this.customNewComment;
          this.$store.dispatch('addTodoComment', {todo, commentContent})
            .then(() => {
              this.customNewComment = '';
              this.$nextTick(
                () => document.getElementById("detailMain").scrollTo(0, document.getElementById("detailMain").scrollHeight));
                      Toast({
                        message: 'Comment Success',
                        position: 'bottom',
                        duration: 1000
                      });
            })
        }
        else{
          Toast({
            message: 'Type Something',
            position: 'bottom',
            duration: 1000
          });
        }
      },
      /*根据最下面评论文本域动态计算内容高度*/
      todoCommentChange() {
        this.$nextTick(() => {
          if (parseInt(document.getElementById('commentArea').offsetHeight) != this.commentAreaOldHeight) {
            this.commentAreaOldHeight = parseInt(document.getElementById('commentArea').offsetHeight);
            document.getElementById('detailMain').style.height =
              ((document.documentElement.clientHeight) - 40 - parseInt(document.getElementById('commentArea').offsetHeight)) + 'px';
            document.getElementById('pushIcon').style.lineHeight = document.getElementById('commentArea').offsetHeight + 'px';

          }
        })
      },
      editClick() {
        document.getElementsByTagName('textarea')[0].focus()
        this.isReadonly = false;
        /*解决vueStar组件必须toggle才有动画*/
        setTimeout(() => {
          this.$refs.vueStar.active = false;
        }, 500)
      },

      todoContentChange() {
        let todo = this.todo;
        let content = this.todoContent;
        this.$store.commit('editTodoContent', {todo, content});
        this.isReadonly = true;
      },

      getAvgCompleteTime() {
        let _arr = this.$store.state.todos;
        let _beginTime;
        let _completeTime;
        let _countTime = 0.00;
        let _countDay = 0.00;
        let avgCompleteTime;
        for (let i = 0; i < _arr.length; i++) {
          if (_arr[i].beginTime && _arr[i].beginTime != '' && _arr[i].completeTime && _arr[i].completeTime != '') {
            _countDay++;
            _beginTime = new Date(_arr[i].beginTime).getTime();
            _completeTime = new Date(_arr[i].completeTime).getTime();
            _countTime += _completeTime - _beginTime;
          }
        }
        _countTime = (parseFloat(_countTime) / (24 * 3600 * 1000)).toFixed(3);
        if (_countDay) {
          avgCompleteTime = (_countTime / _countDay).toFixed(3);
        }
        else {
          avgCompleteTime = '-';
        }
        return avgCompleteTime
      },
      getCompleteTime() {
        return this.todo.completeTime ? this.dateToTime(this.todo.completeTime, this.todo.beginTime) : '-'
      },
      getBeginToNowTime() {
        return this.dateToTime(new Date(), this.todo.beginTime)
      },
      getCompleteToNowTime() {
        return this.todo.completeTime ? this.dateToTime(new Date(), this.todo.completeTime) : '-'
      },
      /*返回2个日期时间差天数2位小数*/
      dateToTime(date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);
        return (parseFloat(date1.getTime() - date2.getTime()) / (24 * 3600 * 1000)).toFixed(3)
      }
    },
    created: function () {
      this.todo = this.$route.params.todo;
      this.index = this.$route.params.index;
      this.todoContent = this.todo.content;
      let completeTime = this.getCompleteTime();
      let avgCompleteTime = this.getAvgCompleteTime();
      let beginToNowTime = this.getBeginToNowTime();
      let CompleteToNowTime = this.getCompleteToNowTime();
      this.chartData = {
        columns: ['事项', '耗时'],
        rows: [
          {'事项': '完成耗时', '耗时': completeTime},
          {'事项': '平均耗时', '耗时': avgCompleteTime},
          {'事项': '开始距今', '耗时': beginToNowTime},
          {'事项': '完成距今', '耗时': CompleteToNowTime}
        ]
      };
      this.chartSettings = {
        label: {
          normal: {show: true, position: "top", formatter: '{c} 天'}
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.commentAreaOldHeight = parseInt(document.getElementById('commentArea').offsetHeight);
        document.getElementById('detailMain').style.height =
          ((document.documentElement.clientHeight) - 40 - parseInt(document.getElementById('commentArea').offsetHeight)) + 'px';
      })
    }
  }
</script>
<style>

</style>
