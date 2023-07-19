<template>
  <modal :show="isActive" @close="close">
    <h5 class="modal-title mb-3" id="exampleModalLabel">Package Details</h5>

    <card
      header-classes="bg-transparent"
      body-classes="px-lg-7"
      class="card-pricing border-0 text-center"
    >
      <!--Header-->
      <h4
        slot="header"
        class="text-uppercase ls-1 text-primary py-3 mb-0"
        v-if="currentPackage.package"
      >{{currentPackage.package.name}} / {{currentPackage.cycle}} month</h4>

      <!--Body-->

      <span
        class="text-muted"
        v-if="currentPackage.package"
      >Trial days: {{currentPackage.package.trial_days}} days</span>
      <ul class="list-unstyled my-4">
        <li v-for="feature in currentPackage.features" :key="feature.id">
          <div class="d-flex align-items-center">
            <div>
              <div
                class="icon icon-xs icon-shape bg-gradient-primary text-white shadow rounded-circle"
              >
                <i class="fas fa-terminal"></i>
              </div>
            </div>
            <div>
              <span class="pl-2 text-sm">{{feature.title}}</span>
            </div>
          </div>
        </li>
      </ul>
      <base-button type="primary" class="mb-3" @click="close">Close</base-button>
    </card>
  </modal>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Package from '@/intefaces/Package';
@Component({
  components: {},
})
export default class ViewPackageFeature extends Vue {
  @Prop() isActive!: boolean;
  @Prop() currentPackage!: Package;

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>
