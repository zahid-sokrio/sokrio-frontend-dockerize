export class QueryBuilder {
    private filters: Map<string, any> = new Map<string, any>();
    public watch: string = '';

    public async setParam(param: string, value: any) {
        if (value != null && value !== '') {
            this.filters.set(param, value);
        } else {
            this.filters.delete(param);
        }
        // Reset page query on change other query
        if (this.filters.has('page') && param !== 'page') {
            this.filters.set('page', 1);
        }
        await this.updateWatcher();
    }

    public addListener(param: string, value: any) {
        if (value != null && value !== '') {
            this.filters.set(param, value);
        } else {
            this.filters.delete(param);
        }
        // Reset page query on change other query
        if (this.filters.has('page') && param !== 'page') {
            this.filters.set('page', 1);
        }
        this.debounce(this.updateWatcher);
    }

    public getFilters(withQuestionMark: boolean = false): string {
        if (this.watch) {
            if (withQuestionMark) {
                return '?'.concat(this.watch);
            } else {
                return this.watch;
            }
        } else {
            return '';
        }
    }

    private async updateWatcher() {
        let paramsArray: string[] = [];
        await this.filters.forEach(function (value, key) {
            paramsArray.push(`${key}=${value}`);
        });
        this.watch = paramsArray.join('&');
    }

    private debounce(fun: Function, wait: number = 1000) {
        let timeout: number | null = null;
        const functionCall = () => fun.apply(this);
        timeout ? clearTimeout(timeout) : '';
        timeout = setTimeout(functionCall, wait);
    }
}
