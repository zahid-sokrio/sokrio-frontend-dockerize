import { Component, Prop, Vue } from 'vue-property-decorator';

// @ts-ignore
@Component
abstract class PaginationComponent extends Vue {
    public pagination: {
        currentPage: number;
        totalEntity: number;
        entityPerPage: number;
        from: number;
        to: number;
        nextPageUrl: string | null,
        prevPageUrl: string | null
    } = {
        currentPage: 1,
        entityPerPage: 0,
        totalEntity: 0,
        from: 0,
        to: 0,
        nextPageUrl: null,
        prevPageUrl: null

    };
    public loading = false;

    public nextPageUrl: string | null = null
    public prevPageUrl: string | null = null

    public setPagination(data: any) {
        this.pagination.currentPage = data.current_page;
        this.pagination.totalEntity = data.total;
        this.pagination.entityPerPage = data.per_page;
        this.pagination.from = data.from;
        this.pagination.to = data.to;
        this.nextPageUrl = data.next_page_url;
        this.prevPageUrl = data.prev_page_url;
    }
}

@Component
//@ts-ignore
export default class PaginationComponentMixin extends PaginationComponent {
}
