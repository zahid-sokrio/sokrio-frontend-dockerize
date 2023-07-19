<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-8">
          <ul class="list-group list-group-flush list my--3">
            <li class="list-group-item px-0">
              <div class="row align-items-center">
                <div class="col-auto">
                  <el-button @click="$router.back()" icon="fa fa-arrow-left" circle></el-button>
                </div>
                <div class="col ml--2">
                  <h4 class="mb-0">{{ $route.meta.label }}</h4>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row pl-3">
        <PerformanceReport></PerformanceReport>
      </div>
      <router-view name="KPIReports"></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PerformanceReport from '@/views/Report/KPI/PerformanceReport.vue'; import {
  Button
} from 'element-ui';

@Component({
  components: { PerformanceReport, [Button.name]: Button },
})
export default class KPIReports extends Vue { }
</script>