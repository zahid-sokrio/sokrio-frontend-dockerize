<template>
<!--  TODO: Home Page-->
  <h1>This is the Admin Home page</h1>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AdminHome extends Vue {
  async mounted(){
    let {data}=await this.$http.get(this.$landLordApi('/features'))
  }
}
</script>
