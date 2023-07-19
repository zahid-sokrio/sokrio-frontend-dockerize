<template>
  <section>
    <confirmation></confirmation>
    <notifications />
    <router-view />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Confirmation from "@/components/Confirmation.vue";
@Component({
  components: {Confirmation}
})
export default class App extends Vue {}
</script>
