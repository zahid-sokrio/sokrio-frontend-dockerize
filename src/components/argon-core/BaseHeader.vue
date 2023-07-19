<template>
  <div class="header" :style="{'background-color': themeColor}">
    <div class="container-fluid">
      <div class="header-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'base-header',
  props: {
    type: {
      type: String,
      default: 'success',
      description: 'Header background type'
    }
  },
  computed: {
    themeColor() {
      return this.$store.getters['Theme/getThemeColor']
    }
  }
}
</script>
<style>
</style>
