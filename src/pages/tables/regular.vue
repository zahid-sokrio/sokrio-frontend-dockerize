<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Tables</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-bread-crumb></route-bread-crumb>
          </nav>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" type="neutral">New</base-button>
          <base-button size="sm" type="neutral">Filters</base-button>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col">
          <light-table/>
        </div>
      </div>
      <inline-actions-table></inline-actions-table>
      <striped-table></striped-table>
      <checkbox-table></checkbox-table>
      <checkbox-colored-table></checkbox-colored-table>
      <translucent-table></translucent-table>
      <dark-table></dark-table>
    </div>
  </div>
</template>
<script>
  import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn } from 'element-ui';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb'
  import projects from '@/components/tables/projects'
  import users from '@/components/tables/users'
  import LightTable from "@/components/tables/RegularTables/LightTable";
  import InlineActionsTable from "@/components/tables/RegularTables/InlineActionsTable";
  import StripedTable from "@/components/tables/RegularTables/StripedTable";
  import CheckboxTable from "@/components/tables/RegularTables/CheckboxTable";
  import CheckboxColoredTable from "@/components/tables/RegularTables/CheckboxColoredTable";
  import TranslucentTable from "@/components/tables/RegularTables/TranslucentTable";
  import DarkTable from "@/components/tables/RegularTables/DarkTable";

  export default {
    layout: 'DashboardLayout',
    components: {
      LightTable,
      InlineActionsTable,
      StripedTable,
      CheckboxTable,
      CheckboxColoredTable,
      TranslucentTable,
      DarkTable,
      RouteBreadCrumb,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        projects,
        users
      };
    }
  };
</script>
