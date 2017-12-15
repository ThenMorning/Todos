/**
* Created with Winward.
* Date: 2017/12/3
* Time: 下午4:26
*
*/
<template>
  <div style="height: 100%;">
    <keep-alive>
      <transition :name="transitionName">
        <router-view class="Router"></router-view>
      </transition>
    </keep-alive>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        transitionName: 'slide-right'
      }
    },
    watch: {
      // 如果路由有变化，会执行该方法
      '$route': function (to,from) {
        this.routeChange(to,from);
      }
    },
    methods: {
      routeChange(to,from) {
        let toName = to.name;
        let fromName = from.name;
        if(toName == 'TodoDetail' || fromName == 'TodoDetail'){
          this.transitionName = 'fade';
        }
        else{
          if (toName == 'App') {
            this.transitionName = 'slide-right';
          }
          else{
            this.transitionName = 'slide-left';
          }
        }
      }
    },
    created() {
    }
  }
</script>
<style>

  /*路由view渐变动画*/

  .Router {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all .5s ease;
    overflow: hidden;
    background-color: #fff;
  }


  /*slide-left slide-right 渐变动画*/

  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100% 0);
  }


  /*fade 渐变动画*/
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .5s
    }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
