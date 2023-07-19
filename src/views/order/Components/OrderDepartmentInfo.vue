<template>
  <div class="row">
    <div class="col-md-6">
      <h5>{{ title }} No.: #{{ currentEntity.code }}</h5>
      <h5>Buyer Department: {{ buyerDepartment.name }} | {{ buyerDepartment.code }}</h5>
      <h5>Buyer Channel: {{ buyerDepartment.department_type ? buyerDepartment.department_type.name : '-' }}</h5>
      <h5>Buyer Badge: {{ buyerDepartment.badge ? buyerDepartment.badge.name : '-' }}</h5>
      <h5>Territory: {{ buyerDepartment.territory ? buyerDepartment.territory.name : '-' }}</h5>
      <h5>Contact No.: {{ buyerDepartment.phone_no }}</h5>
      <h5>Address: {{ buyerDepartment.address }}</h5>
    </div>
    <div class="col-md-6">
      <h5>{{ title }} Revisions.:
        <a href="#" @click.prevent="isActiveRevision = true"><i class="fas fa-list-alt ml-2"
                                                                style="font-size: 20px"></i></a>
      </h5>
      <revision-list :isActiveRevision.sync="isActiveRevision" :entity-id="currentEntity.id"
                     :revision-list="revisionList"></revision-list>
      <h5>{{ title }} Status : {{ _.startCase(currentEntity.latest_status) }} </h5>
      <h5>{{ title }} Date: {{ currentEntity.created_at | datetime('ll') }}</h5>
      <h5>Supplier Department: {{ sellerDepartment.name }} | {{ sellerDepartment.code }}</h5>
      <h5>Territory: {{ sellerDepartment.territory ? sellerDepartment.territory.name : '-' }}</h5>
      <h5>Contact No.: {{ sellerDepartment.phone_no }}</h5>
      <h5>Address: {{ sellerDepartment.address }}</h5>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import Order from "@/intefaces/Order";
import RevisionList from "@/views/order/Components/RevisionList.vue";
import OrderRevision from "@/intefaces/OrderRevision";
import Department from "@/intefaces/Department";

@Component({
  components: {
    RevisionList,
  }
})
export default class OrderDepartmentInfo extends Vue {
  @Prop() title!: string;
  @Prop() currentEntity!: Order;
  @Prop() revisionList!: OrderRevision[];
  private isActiveRevision: boolean = false;
  private buyerDepartment = '';
  private sellerDepartment = '';

  created() {
    this.$http.get(this.$api(`/departments/${this.currentEntity.buyer_id}`)).then(response => {
      this.buyerDepartment = response.data.department;
    })
    this.$http.get(this.$api(`/departments/${this.currentEntity.seller_id}`)).then(response => {
      this.sellerDepartment = response.data.department;
    })

  }
}
</script>
