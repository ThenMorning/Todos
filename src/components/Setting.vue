<template>
  <div>
    <mt-header title="Setting">
      <router-link to="/" slot="left">
        <mt-button>
          <img src="../assets/home.png" height="20" width="20" slot="icon">
        </mt-button>
      </router-link>
      <!--<mt-button icon="more" slot="right"></mt-button>-->
    </mt-header>
    <div>
        <x-button :gradients="['#A644FF', '#FC5BC4']" @click.native="downloadData('notepad.txt',getData)">download</x-button>
    </div>
  </div>
</template>
<script>
  import { XButton } from 'vux'
  export default {
    data() {
      return {}
    },
    components:{
      XButton
    },
    watch: {},
    computed: {
      getData() {
        const self = this;
        return JSON.stringify(self.$store.state);
      }
    },
    methods: {
      downloadData(fileName, content) {
        let aTag = document.createElement('a');
        let blob = new Blob([content]);
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        console.log(URL.revokeObjectURL(blob));
        /*aTag.click();
        URL.revokeObjectURL(blob);*/
      }

      /*测试cordova
        camera(){
        navigator.camera.getPicture(
          function () {

          },
          function () {

          },
          { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation:true,
            popoverOptions:CameraPopoverOptions,
            mediaType:1
          });
      }*/
    },
    created() {
    }
  }
</script>
<style>
</style>
