<template>
  <modal :show.sync="dialog" style="z-index: 999999999999999!important;">
    <template>
      <h5 class="modal-title" v-text="title"></h5>
    </template>
    <p v-text="body"></p>
    <template slot="footer">
      <base-button type="secondary" @click="onReject">{{ rejectBtnText }}</base-button>
      <base-button type="warning" @click="onAccept">{{ confirmBtnText }}</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Confirmation extends Vue {

  get dialog(): boolean {
    return this.$store.getters['Confirmation/dialog'];
  }

  get title(): boolean {
    return this.$store.getters['Confirmation/title'];
  }

  get body(): boolean {
    return this.$store.getters['Confirmation/body'];
  }

  get rejectBtnText(): boolean {
    return this.$store.getters['Confirmation/rejectBtnText'];
  }

  get confirmBtnText() {
    return this.$store.getters['Confirmation/confirmBtnText'];
  }

  get loading() {
    return this.$store.getters['Confirmation/loading'];
  }

  async onAccept() {
    await this.$store.dispatch('Confirmation/accept')
  }

  async onReject() {
    await this.$store.dispatch('Confirmation/reject')
  }

}
</script>
