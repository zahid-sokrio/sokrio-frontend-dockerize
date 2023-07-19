<template>
  <div>
    <slot :image-src="imageSrc"></slot>
  </div>
</template>
<script lang="ts">
import axios, { AxiosError, AxiosResponse } from 'axios';
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class AsyncImageForLandLord extends Vue {
  // Required props
  @Prop({required: true})
  url!: string;

  public imageSrc: any = '';
  public errors: any;

  mounted() {
    this.$http
      .get(this.$api(this.url))
      .then((response: AxiosResponse) => {
        this.imageSrc = response.data.logo;
      })
      .catch((err: AxiosError) => {
        this.errors = err.response?.data.errors;
      });
  }

}
</script>
