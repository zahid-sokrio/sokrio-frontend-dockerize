<template>
  <div>
    <slot :image-src="imageSrc"></slot>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class AsyncImage extends Vue {
  // Required props
  @Prop({required: true})
  url!: string;

  public imageSrc: any = '';

  mounted() {
    this.$blob2Url(this.url).then((response: any) => {
      this.imageSrc = response;
    })
  }

}
</script>
