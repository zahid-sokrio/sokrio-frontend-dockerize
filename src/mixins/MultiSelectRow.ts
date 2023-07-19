import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ElTable } from 'element-ui/types/table';

// @ts-ignore
@Component
abstract class MultiSelectRow extends Vue {
  public selectedRows: any[] = [];
  public allItemSelected: boolean = false;

  public handleSelectionChange(value: any) {
    this.selectedRows = value;
    if (this.allItemSelected) {
      this.allItemSelected = false;
    }
  }

  public async selectAllItems() {
    (this.$refs.multipleTable as ElTable).clearSelection();
    (this.$refs.multipleTable as ElTable).toggleAllSelection();
    setTimeout(()=> {
      this.allItemSelected = true;
    }, 15);
  }

  public deselectAllItems() {
    (this.$refs.multipleTable as ElTable).clearSelection();
    this.allItemSelected = false;
  }

  public getRowKeys(row: any) {
    return row.id;
  }

  @Watch('pagination.currentPage')
  onChangePagination(value: Number) {}
}

@Component
//@ts-ignore
export default class MultiSelectRowMixin extends MultiSelectRow {}
