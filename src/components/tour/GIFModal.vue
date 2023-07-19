<template>
  <modal :show="showGIF" v-if="showGIF" @close="close()">
    <h6 slot="header" class="modal-title" id="modal-title-default">{{ demoTourTitle }}</h6>

    <el-carousel indicator-position="outside" :autoplay="false">
      <el-carousel-item v-for="(GIFentity, index) in GIFs" :key="index">
        <iframe :src="GIFentity.url" width="100%" height="250" frameBorder="0" allowfullscreen></iframe>

        <br/>
        <h3 class="text-center mt-5">{{ GIFentity.label }}</h3>
      </el-carousel-item>
    </el-carousel>

    <template slot="footer">
      <base-button type="primary" class="ml-auto" @click="close()">Done</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Carousel, CarouselItem} from 'element-ui';

@Component({
  components: {
    [Carousel.name]: Carousel,
    [CarouselItem.name]: CarouselItem
  }
})
export default class GIFModal extends Vue {

  @Prop()
  GIFs!: any;

  @Prop()
  demoTourEntity!: string;

  @Prop()
  demoTourTitle!: string;

  @Prop()
  showGIF!: boolean;

  close(){
    this.$emit('update:showGIF', false)
  }
}
</script>
