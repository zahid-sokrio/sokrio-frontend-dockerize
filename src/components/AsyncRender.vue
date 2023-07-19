<template>
  <span>
    {{ value }}
  </span>
</template>
<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class AsyncRender extends Vue {
  // Required props
  @Prop({ required: true })
  url!: string;
  @Prop({ required: true })
  callback!: Function;

  public value: any ='';

  mounted() {
    this.$http.get(this.$api(`${this.url}`)).then(response => {
      this.value = this.callback(response);
    })
  }

}
</script>
