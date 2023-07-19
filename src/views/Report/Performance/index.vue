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
      <div v-if="$route.name == 'performance-report'" class="row pl-3">
        <div v-for="(report, index) in reports" :key="index" class="col-xl-6 col-md-6 ">
          <a href="#" @click.prevent="$router.push({ name: report.path })" v-can="report.permission">
            <stats-card type="gradient-green" :sub-title="report.name" icon="ni ni-bullet-list-67">
              <template slot="footer">
                <div class="row">
                  <div class="col-md-6">
                    <!--                    <span class="text-nowrap"> <i class="ni ni-email-83"></i> {{-->
                    <!--                        todaysDate() | datetime('ll')-->
                    <!--                      }} </span>-->
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
      <router-view name="performanceReport"></router-view>
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
export default class PerformanceReport extends Vue {
  private reports: any[] = [
    {
      name: 'Daily KPI Report',
      tooltip: 'Daily KPI Report.',
      permission: PermissionEnum.PRODUCT_BASED_REPORT,
      path: 'daily-kpi-report'
    },
    {
      name: 'User-Wise Product Performance Report',
      tooltip: 'Find out how the product is performing user wise.',
      permission: PermissionEnum.PRODUCT_BASED_REPORT,
      path: 'user-wise-product-performance-report'
    },
    {
      name: 'Dept-Wise Product Performance Report',
      tooltip: 'Find out how the product is performing department wise.',
      permission: PermissionEnum.PRODUCT_BASED_REPORT,
      path: 'dept-wise-product-performance-report'
    },
    {
      name: 'No Order Report',
      tooltip: 'No order report',
      permission: PermissionEnum.PRODUCT_BASED_REPORT,
      path: 'no-order-report'
    },
    {
      name: 'Daily Call Report',
      tooltip: 'Daily Performance',
      permission: PermissionEnum.DAILY_CALL_REPORT,
      path: 'daily-call-report'
    },
    {
      name: 'Performance Board Report',
      tooltip: 'Performance Board Report',
      permission: PermissionEnum.PERFORMANCE_BOARD_REPORT,
      path: 'performance-board-report'
    },
    {
      name: 'Product Target Achievement Report',
      tooltip: 'Product Target Achievement Report',
      permission: PermissionEnum.TARGET_VS_ACHIEVEMENT_REPORT,
      path: 'product-target-achievement-report'
    },
    {
      name: 'Not Ordered Outlet List Report',
      tooltip: 'Not Ordered Outlet List Report',
      permission: PermissionEnum.NOT_ORDERED_REPORT,
      path: 'not-ordered-outlet-list-report'
    }
  ];

  todaysDate() {
    var currentDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return currentDate;
  }
}
</script>
