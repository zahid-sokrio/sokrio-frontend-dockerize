<template>
  <modal :show="showUploadImagesModal"
         modal-classes="modal-dialog-centered modal-lg"
         class="modal-dialog-scrollable"
         v-if="showUploadImagesModal" @close="close()">
    <div>
      <div>
        <div class="modal-dialog-scrollable">
                        <el-upload class="avatar-uploader"
                                   ref="upload"
                                   action="#"
                                   multiple
                                   accept=".png, .jpg"
                                   :limit="5"
                                   :file-list="fileList"
                                   :on-change="handleChange"
                                   :auto-upload="false"
                                   list-type="picture-card"
                                   show-file-list>
          <el-button size="small" type="secondary" @click="showUploadImagesModal = true">Select
            files</el-button>
                               </el-upload>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import AsyncImage from "@/components/AsyncImage.vue";
import {Button, Carousel, CarouselItem, Image, Upload} from "element-ui";

@Component({
  components: {
    AsyncImage,
    [Carousel.name]: Carousel,
    [CarouselItem.name]: CarouselItem,
    [Image.name]: Image,
    [Upload.name]: Upload,
    [Button.name]: Button,
  }
})
export default class ImagesModal extends Vue {
  // @Prop()
  // images!: any;
  private images = ["/users/1/propic", "/users/1/propic", "/users/1/propic"]
  @Prop({type: Boolean, default: false})
  public showUploadImagesModal!: boolean;
  private showFullImage: boolean = false;
  public fileList = [];

  close() {
    this.$emit('update:showUploadImagesModal', false);
  }

  showFullImagea() {
    // this.showFullImage =
  }

  handleChange (File: any, fileList: any) {
    this.fileList = fileList;
  }


}
</script>
<style scoped>
.modal-body {
  height: 100px !important;
}
</style>
