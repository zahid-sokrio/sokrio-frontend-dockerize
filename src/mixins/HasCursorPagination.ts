import { Component, Prop, Vue } from 'vue-property-decorator';

// @ts-ignore
@Component
abstract class HasCursorPagination extends Vue {

    public loading = false;
    public currentCursor: string | null = null
    public nextPageCursor: string | null = null
    public prevPageCursor: string | null = null

    public setPagination(data: any) {
        this.nextPageCursor = data.next_page_cursor;
        this.prevPageCursor = data.prev_page_cursor;
    }
}

@Component
//@ts-ignore
export default class HasCursorPaginationMixin extends HasCursorPagination {}
