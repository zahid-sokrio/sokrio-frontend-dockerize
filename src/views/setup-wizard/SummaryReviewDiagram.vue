<template>
  <div class="container p-2">
    <div v-for="(currentEntity, i) in currentEntities" :key="i" >
      <div class="row justify-content-center">
        <div class="col col-2 p-2">
          <div class="row">
            <el-tooltip :content="currentEntity.name" :disabled="!currentEntity.name" placement="left">
              <base-button class="btn-block" size="sm" style="pointer-events: none;" type="secondary">{{ currentEntity.name }}</base-button>
            </el-tooltip>
          </div>
          <div class="row justify-content-center">
            <div v-if="i !== currentEntities.length - 1" class="col col-3">
                                      <span class=" small">
                                        <i class="fas fa-arrow-down fa-sm"></i>
                                      </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mb-1">
      <div class="col col-3">
        <el-tooltip content="Edit" placement="left">
          <a class="timeline-step badge-info small" href="#!" @click.prevent="updateStep">
            <i class="fas fa-edit fa-sm"></i>
          </a>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class SummaryReviewDiagram extends Vue {
  @Prop() currentEntities!: any;
  @Prop() step!: number;

  updateStep() {
    this.$store.dispatch('SetupWizard/updateCurrentStep', this.step);
    this.$emit('triggerEdit', null);
  }
}
</script>
