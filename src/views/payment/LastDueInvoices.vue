<template>
  <section>
    <modal :show="isActive" size="lg" @close="close">
      <div class="col-xs-12 heading mt-2">
        Previous 5 due {{ getTaxonomy('invoice') }}(s)
      </div>
      <div class="row justify-content-between mx-4">

      </div>

      <div class="pl-2 pr-2 text-center">
        <ul class="list-group list-group-flush list my--1">
          <li class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-3">
                <small>{{ getTaxonomy('invoice') }} ID</small>
              </div>
              <div class="col-md-2">
                <small>{{ getTaxonomy('invoice') }} Amt </small>
              </div>
              <div class="col-md-2">
                <small>Paid Amt</small>
              </div>
              <div class="col-md-2">
                <small>Due Amt</small>
              </div>
              <div class="col-md-3">
                <small>Days passed</small>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0">
            <div class="row align-items-center">

              <div class="col-7 ml-5">
                <h5 class="float-left">Carried Over Balance</h5>
              </div>

              <div class="col-3 ml-4">
                <div class="float-left"> {{ dues.dueWithoutLatestFive }}
                </div>
              </div>

              <div></div>
            </div>
          </li>

          <hr>
          <div v-if="dues.LatestFiveDueInvoices.length > 0 ">

            <li v-for="(invoice,index) in dues.LatestFiveDueInvoices" :key="index" class="list-group-item px-0">
              <div class="row align-items-center">
                <div class="col-md-3">
                  <small v-if="invoice!=null">{{ invoice.code }}</small>
                </div>
                <div class="col-md-2">
                  <small>{{ invoice.amount }}</small>
                </div>
                <div class="col-md-2">
                  <small>{{ invoice.payable - invoice.remainder }}</small>
                </div>
                <div class="col-md-2">
                  <small>{{ invoice.remainder }}</small>
                </div>
                <div class="col-md-3">
                  <small>{{ invoice.created_at | toDays }}</small>
                </div>
              </div>
            </li>
          </div>
          <li v-else class="list-group-item px-0">
            <div class="col-md-12">
              No Due Found
            </div>
          </li>


          <li v-if="dues.LatestFiveDueInvoices.length>0" class="list-group-item px-0">
            <div class="row align-items-center">
              <div class="col-md-3">
                <small style="">Total</small>
              </div>
              <div class="col-md-2">
                <small>{{ dues.LatestFiveDueInvoices.map(e => e.amount).reduce((s, a) => Number(s) + Number(a)) }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ dues.LatestFiveDueInvoices.map(e => (e.payable - e.remainder)).reduce((s, a) => Number(s) + Number(a)) }}</small>
              </div>
              <div class="col-md-2">
                <small>{{ dues.LatestFiveDueInvoices.map(e => e.remainder).reduce((s, a) => Number(s) + Number(a)) + dues.dueWithoutLatestFive }}</small>
              </div>
              <div class="col-md-3">
                <div></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <base-button class="d-flex float-right" type="secondary" @click="close">Close</base-button>

    </modal>
  </section>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip} from "element-ui";
import moment from "moment";
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag
  },

  filters: {
    toDays(value: any) {
      return moment(value).fromNow();
    }
  }

})
export default class LastDueInvoices extends Mixins(TaxonomyMixin) {
  @Prop() isActive!: boolean;
  @Prop() dues !: any;

  close() {
    this.$emit('update:isActive', false);
  }
}
</script>

<style scoped>

</style>
