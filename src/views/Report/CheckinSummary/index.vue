<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-8">
          <ul class="list-group list-group-flush list my--3">
            <li class="list-group-item px-0">
              <div class="row align-items-center">
                <div v-if="this.$route.matched.length > 3" class="col-auto">
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
      <div v-if="$route.name == 'checkin-summary'" class="row pl-3">
        <div v-for="(report, index) in reports" :key="index" class="col-xl-6 col-md-6 ">
          <a href="#" @click.prevent="$router.push({ name: report.path })" >
            <stats-card type="gradient-green" :sub-title="report.name" icon="ni ni-bullet-list-67">
              <template slot="footer">
                <div class="row">
                  <div class="col-md-6">
                  </div>
                  <div class="col-md-6">
                    <el-tooltip class="ml-3" :content="report.tooltip" placement="right">
                      <i class="fas fa-info-circle" style="color: #5e72e4; font-size: 28px; margin-right: 0.60rem; float: right"></i>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </stats-card>
          </a>
        </div>
      </div>
      <router-view name="CheckinSummary"></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Permission as PermissionEnum } from '@/enums/Permission';
import { Button } from 'element-ui';

@Component({
  components: {
    [Button.name]: Button
  }
})
export default class CheckinSummaryReport extends Vue {
  private reports: any[] = [
    {
      name: 'Checkin Summary',
      tooltip: 'Checkin Summary Report.',
      path: ''
    },
    {
      name: 'Checkin Summary Details',
      tooltip: 'Checkin Summary Details Report.',
      path: 'checkin-summary-details'
    },
  ];
}
</script>
