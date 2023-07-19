<template>
  <modal :show="showImage"
         modal-classes="modal-dialog-centered modal-lg"
         class="modal-dialog-scrollable"
         v-if="showImage" @close="close()">

    <template slot="header">
      <h5 class="modal-title" id="statusModal">Travel Allowance Documents</h5>
    </template>

      <div>
        <el-carousel indicator-position="outside" :autoplay="false" height="600px">
          <el-carousel-item v-for="(image, index) in imagesUrls" :key="index">
            <el-image
              :src="image"
              :preview-src-list="[image]"
            >
            </el-image>
            <br/>
          </el-carousel-item>
          <loading-panel style="margin-top: 25%" v-if="!imagesUrls.length"></loading-panel>
        </el-carousel>
      </div>

    <template slot="footer">
      <base-button type="primary" @click="close()">Close</base-button>
    </template>

  </modal>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import AsyncImage from "@/components/AsyncImage.vue";
import {Carousel, CarouselItem, Image} from "element-ui";
import LoadingPanel from "@/components/argon-core/LoadingPanel.vue";

@Component({
  components: {
    LoadingPanel,
    AsyncImage,
    [Carousel.name]: Carousel,
    [CarouselItem.name]: CarouselItem,
    [Image.name]: Image
  }
})
export default class ImagesModal extends Vue {
  @Prop()
  images!: Array<any>;
  imagesUrls: String[] = []
  // private images = ["/users/1/propic", "/users/1/propic", "/users/1/propic"]
  @Prop({type: Boolean, default: false})
  public showImage!: boolean;

  mounted() {
    this.images.forEach(async value => {
      let data = null;
      if (process.env.NODE_ENV === 'production') {
        data = (await this.$http.get(this.$api('/file?path=' + value))).data;
      } else {
        data = await this.$blob2Url('/file?path=' + value);
      }
      this.imagesUrls.push(data);
    })
  }

  close() {
    this.$emit('update:showImage', false);
  }

}
</script>
<style scoped>
.modal-body {
  height: 100px !important;
}
</style>
