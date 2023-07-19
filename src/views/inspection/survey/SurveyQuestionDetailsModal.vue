<template>
  <modal v-if="isActiveDetails" :show="isActiveDetails" id="answersModal" modalContentClasses="answersModal"
         class="modal-dialog-scrollable" mode @close="close" size="sm">
    <template slot="header">
      <h5 class="modal-title">Answers</h5>
    </template>
    <div class="row" v-if="typeof currentEntity.options[0] === 'number'">
      <div class="col-sm-6">
        <div class="rating-block">
          <h4>Average User Rating</h4>
          <h2 class="bold padding-bottom-7">{{ Number(getAverage).toFixed(2) }}<small>/ 5</small></h2>
          <el-rate :value="Number(getAverage)" disabled></el-rate>
        </div>
      </div>
      <div class="col-sm-6">
        <div v-for="(response, name, index) in responseRates" :key="index">
          <span> {{ name }}</span>
          <base-progress type="default" :height="5" :value="Number(response)"></base-progress>
        </div>
      </div>
    </div>
    <div class="row">

      <div :class="[currentEntity.type=='image'?'col-12':'col-6']">
        <ul v-if="currentEntity.type !== 'image'" class="list-group list-group-flush" data-toggle="checklist">
          <li class="list-group-item px-0" v-for="item in answers" :key="item.id">
            <div class="checklist-item checklist-item-success">
              <div class="checklist-info">
                <h3 class="checklist-title mb-0">{{ item.participant }} | <span class="text-success">{{
                    item.options
                  }}</span></h3>
                <h3>{{ item.phone }}</h3>
                <h5>{{ item.created_at | datetime('lll') }}</h5>
              </div>
            </div>
          </li>
        </ul>
        <template v-else v-for="item in answers">
          <card :key="item.id">
            <div class="row align-items-center">
              <div class="col-auto">
                <a href="#" class="avatar avatar-xl">
                  <AsyncImage v-slot="slotProps" :url="item.photo_url">
                    <img :src="slotProps.imageSrc" class="rounded-circle avatar avatar-lg"/>
                  </AsyncImage>
<!--                  <img alt="Image placeholder" src="https://demos.creative-tim.com/vue-argon-dashboard-pro/img/theme/team-2.jpg">-->
                </a>
              </div>
              <div class="col ml--2">
                <h4 class="mb-0">
                  <a href="#!">{{ item.participant }}</a>
                </h4>
                <p class="text-sm text-muted mb-0">{{ item.phone }}</p>
                <small>{{ item.created_at | datetime('lll') }}</small>
              </div>
            </div>
          </card>
        </template>

        <base-pagination
          class="mt-3"
          v-if="answers.length > 0"
          v-model="pagination.currentPage"
          :perPage="pagination.entityPerPage"
          :total="pagination.totalEntity"
          align="center"
          :disabled="loading"
        ></base-pagination>
      </div>
      <div class="col-6" v-if="currentEntity.type === 'checkbox' || 'radio'">
        <div class="chart">
          <pie-chart
            :height="350"
            :chart-data="pieChart.chartData"
          >
          </pie-chart>
        </div>
      </div>
    </div>
    <template slot="footer">
      <base-button type="secondary" @click="close">Close</base-button>
      <!--      <base-button type="success" :loading="exporting" @click="exportAnswers">Export</base-button>-->
    </template>
  </modal>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch, Mixins} from 'vue-property-decorator';
import Question from '@/intefaces/Question';
import Answer from '@/intefaces/Answer';
import PaginationComponentMixin from "@/mixins/PaginationComponent";
// @ts-ignore
import PieChart from '@/components/argon-core/Charts/PieChart';
// @ts-ignore
import * as chartConfigs from '@/components/argon-core/Charts/config';
import AsyncImage from "@/components/AsyncImage.vue";


@Component({
  components: {
    AsyncImage,
    PieChart
  }
})
export default class SurveyQuestionDetailsModal extends Mixins(PaginationComponentMixin) {
  @Prop({default: null})
  currentEntity!: any;
  @Prop()
  isActiveDetails!: boolean;
  public exporting: boolean = false;
  public loading: boolean = false;
  private answers: Array<Answer> = [];
  private responseRates: any = [];
  private labels: any = [];
  private allData: any = [];
  private getAverage: any = 0;
  private colors: any = ['#2d9bce', '#497aad', '#39abcd']
  private value1: any = 3.7;

  checkingNumOrStr() {
    if (typeof this.currentEntity.options[0] === 'number') {
      return 'col-12'
    } else return 'col-6'
  }

  private pieChart: any = {
    chartData: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#5e72e4', '#fb6340', '#2dce89', '#2bffc6'],
          label: 'Dataset 1'
        }
      ]
    },
    extraOptions: chartConfigs.blueChartOptions,
  };

  initPieChart(label: any, data: any) {
    let chartData = {
      datasets: [
        {
          label: 'Dataset',
          data: data,
          backgroundColor: ['#5e72e4', '#fb6340', '#2dce89', '#2bffc6'],
        }
      ],
      labels: label
    };
    this.pieChart.chartData = chartData;
  }


  @Watch('currentEntity')
  onChangeCurrentEntity(val: Question) {
    if (!val) return;
    this.fetchAnswers();
    this.fetchResponseRates()
  }

  @Watch('pagination.currentPage')
  async fetchAnswers() {
    this.loading = true;
    this.answers = [];
    const {data} = await this.$http.get(this.$api(`/surveys/${this.currentEntity.pivot.survey_id}/questions/${this.currentEntity.id}/answers`));
    this.answers = data.answers;
    this.setPagination(data)
    this.loading = false;
  }

  async fetchResponseRates() {
    const {data} = await this.$http.get(this.$api(`/surveys/${this.currentEntity.pivot.survey_id}/questions/${this.currentEntity.id}/response-rates`));
    this.responseRates = data.responseRates
    let response = data.responseRates
    let totalRating = 0;
    this.labels = Object.keys(response)
    this.allData = Object.values(response)
    for (let i = 0; i < this.labels.length; i++) {
      totalRating += this.labels[i] * this.allData[i]
    }
    this.getAverage = totalRating / 100
    if (typeof this.currentEntity.options[0] === 'string') {
      this.initPieChart(this.labels, this.allData)
    }
  }

  exportAnswers() {
    //TODO-miraj: implement answer export
    throw 'Need to implement';
  }

  close() {
    this.$emit('update:isActiveDetails', false);
  }
}
</script>

<style scoped>
.ratingHeader {
  font-size: 35px;
  margin-right: 25px;
}

.fa {
  font-size: 25px;
}

.checked {
  color: orange;
}

/* Three column layout */
.side {
  float: right;
  width: 15%;
  margin-top: 10px;
  margin-left: 17px;
}

.middle {
  margin-top: 19px;
  float: left;
  width: 70%;
}

/* Place text to the right */
.right {
  text-align: right;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* The bar container */
.bar-container {
  width: 100%;
  background-color: #f1f1f1;
  text-align: center;
  color: white;
}

/* Individual bars */
.bar-5 {
  width: 60%;
  height: 18px;
  background-color: #4CAF50;
}

.bar-4 {
  width: 30%;
  height: 18px;
  background-color: #2196F3;
}

.bar-3 {
  width: 10%;
  height: 18px;
  background-color: #00bcd4;
}

.bar-2 {
  width: 4%;
  height: 18px;
  background-color: #ff9800;
}

.bar-1 {
  width: 15%;
  height: 18px;
  background-color: #f44336;
}

</style>
