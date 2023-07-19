<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <base-input
          v-model="form.target_name"
          type="string"
          :rules="{ required: true }"
          label="Target Name"
          name="Target Name"
          placeholder="Target Name"
        ></base-input>
      </div>

      <div class="col-md-6">
        <base-input label="Date" type="month" :rules="{ required: true }" v-model="form.start_from"> </base-input>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import TargetModalData from '@/mixins/TargetModalData';

@Component({
  components: {}
})
export default class TargetNameComponent extends Mixins(TargetModalData) {}
</script>
