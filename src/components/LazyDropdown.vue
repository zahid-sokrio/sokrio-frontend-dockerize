<template>
  <div>
    <base-input :name="name" :label="label" :rules="rules" autocomplete="off">
      <el-select
        ref="elselect"
        :loading="loading"
        :multiple="multiple"
        :collapse-tags="collapseTags"
        :value="value"
        @input="$emit('input', $event)"
        clearable
        :placeholder="placeholder"
        remote
        :remote-method="remoteMethod"
        filterable
        :filter-method="() => null"
        :disabled="disabled"
        @clear="clear"
        @change="change"
        @remove-tag="removeTag"
        @click="click"
      >
        <el-option v-if="hasCreateSlot && addButton" disabled value="0" label="Create New">
          <p class="text-black-50 font-weight-bolder create-button" @click="onClickCreate">Create New</p>
        </el-option>
        <span class="hidden" id="firstItemTrigger" ref="firstItemTrigger"></span>
        <el-option v-if="hasAllOption" :value="0" label="All">
          <p class="text-black-50 font-weight-bolder">All</p>
        </el-option>
        <el-option
          v-for="entity in entities"
          :key="entity[itemValue]"
          :label="resolveNesting(itemText, entity)"
          :value="resolveNesting(itemValue, entity)"
        >
          <slot name="dropDownItem" v-bind:item="entity">
            {{ resolveNesting(itemText, entity) }} {{ itemSubText ? ' | ' + resolveNesting(itemSubText, entity) : '' }}
          </slot>
        </el-option>
        <span id="lastItemTrigger" ref="lastItemTrigger"></span>
      </el-select>
    </base-input>
    <slot name="createModal" v-bind:isActive="isActive" v-bind:afterCreated="afterCreated"></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop, Mixins } from 'vue-property-decorator';
import DropdownField from '@/mixins/DropdownField';
import { ElSelect } from "element-ui/types/select";

@Component({
  components: {}
})
export default class LazyDropdown extends Mixins(DropdownField) {
  @Prop({default: 'name'})
  itemText!: string;
  @Prop({default: ''})
  itemSubText!: string;
  @Prop({default: 'id'})
  itemValue!: string;

  // Required props
  @Prop({required: true})
  endPoint!: string;
  @Prop({required: true})
  resourceKey!: string;
  @Prop({required: true, default: 'name'})
  searchableKey!: string;
  @Prop({default: false})
  landlord!: boolean;
  @Prop({default: true})
  addButton!: false;
  @Prop({default: false})
  hasAllOption!: false;
  @Prop({default: true})
  fetchOnChangeDisable!: boolean;
  @Prop({ default: 1 })
  apiVersion!: number;

  private observing = false;
  private query: string = '';
  private observer!: IntersectionObserver;
  private entities: any[] = [];
  private isActive: boolean = false;
  private loading: boolean = false;
  private newCreatedEntity = [];
  private root_scrollbar__wrap!: Element & ElementCSSInlineStyle;
  private firstItemTrigger!: Element & ElementCSSInlineStyle;
  private lastItemTrigger!: Element & ElementCSSInlineStyle;
  private pagination = {
    currentPage: {
      top: 1,
      bottom: 1
    },
    per_page: 0,
    next_page_url: null
  };

  // Lifecycle hooks +++
  mounted() {
    this.root_scrollbar__wrap = this.$el.querySelector('.el-scrollbar__wrap') as Element & ElementCSSInlineStyle;
    this.firstItemTrigger = this.$el.querySelector('#firstItemTrigger') as Element & ElementCSSInlineStyle;
    this.lastItemTrigger = this.$el.querySelector('#lastItemTrigger') as Element & ElementCSSInlineStyle;
    this.root_scrollbar__wrap.addEventListener('scroll', this.onScroll);
    this.$on('update:isActive', (value: boolean) => (this.isActive = value));
    this.observer = new IntersectionObserver(this.intersectionHandler, {root: this.root_scrollbar__wrap});
    this.fetchEntries(this.pagination.currentPage.top, 'end');
  }

  destroy() {
    this.disconnectObserver();
  }

  // Lifecycle hooks ---

  // Watchers +++
  @Watch('entities')
  onChangeEntity(value: any[]) {
    this.$emit('entities', value);
    // Init the observer once, if we have more then one page
    this.$nextTick(() => {
      if (value.length > 0) {
        if (this.pagination.next_page_url && !this.observing) {
          this.initInterceptionObserver();
        }
      }
    });
  }

  @Watch('endPoint')
  onChangeEndPoint() {
    this.fetchOnChangeQuery();
  }

  @Watch('disabled')
  onDisabled(value: any) {
    // if disable == true
    if (value) {
      this.$emit('input', this.multiple ? [] : null);
    } else if (this.fetchOnChangeDisable) {
      this.fetchEntries(1, 'override')
    }
  }

  // Watchers ---

  // ## methods +++
  async fetchEntries(page: number, addTo: string) {
    if (this.disabled) {
      return
    }

    let apiUrl = this.$api(this.apiEndpoint(page));
    if (this.apiVersion === 2) {
      apiUrl = this.$api2(this.apiEndpoint(page));
    } else if (this.apiVersion === 3) {
       apiUrl = this.$api3(this.apiEndpoint(page));
    }

    const {data} = this.landlord
      ? await this.$http.get(this.$landLordApi(this.apiEndpoint(page)))
      : await this.$http.get(apiUrl);
    this.pagination.per_page = data.per_page;
    this.pagination.next_page_url = data.next_page_url;
    switch (addTo) {
      case 'end':
        data[this.resourceKey].forEach((item: any) => this.entities.push(item));
        break;
      case 'start':
        data[this.resourceKey].reverse().forEach((item: any) => this.entities.unshift(item));
        break;
      case 'override':
        this.entities = data[this.resourceKey];
        break;
    }
  }

  async afterCreated(entity: any) {
    this.isActive = false;
    this.$parent.$emit('newCreatedEntity', entity);
    this.entities.unshift(entity);
    if (this.entities.length >= this.pagination.per_page) {
      this.entities.pop();
    }
    if (this.multiple) {
      this.$parent.$emit('input', [this.resolveNesting(this.itemValue, entity)]);
    } else {
      this.$parent.$emit('input', this.resolveNesting(this.itemValue, entity));
      this.$emit('input', this.resolveNesting(this.itemValue, entity));
    }

  }

  initInterceptionObserver() {
    let firstItemTrigger = this.$refs.firstItemTrigger as Element;
    let lastItemTrigger = this.$refs.lastItemTrigger as Element;
    this.observer.observe(firstItemTrigger);
    this.observer.observe(lastItemTrigger);
    this.observing = true;
  }

  onScroll() {
    // let st = this.root_scrollbar__wrap.scrollTop;
    // if (this.root_scrollbar__wrap.scrollTop > this.lastScrollTop) {
    //   // down scroll
    //   console.log('down---');
    //   console.log(Math.round(this.root_scrollbar__wrap.scrollTop * 0.5));
    //   // this.firstItemTrigger.style.top = '0';
    //   this.lastItemTrigger.style.top = `-${Math.round(this.root_scrollbar__wrap.scrollTop * 0.4)}px`;
    // } else {
    //   // up scroll
    //   console.log(this.root_scrollbar__wrap.scrollTop/.35)
    //   this.firstItemTrigger.style.top = Math.round( this.root_scrollbar__wrap.scrollTop/.35) + 'px';
    //   // this.lastItemTrigger.style.top = '0';
    //   console.log('up---');
    // }
    // this.lastScrollTop = st <= 0 ? 0 : st;
  }

  async intersectionHandler(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    for await (const entry of entries) {
      if (entry.target.id == 'firstItemTrigger' && entry.isIntersecting && this.pagination.currentPage.top > 1) {
        this.pagination.currentPage.top--;
        await this.fetchEntries(this.pagination.currentPage.top, 'start');
        this.pagination.currentPage.bottom--;
        this.removeItemFromBottom(this.pagination.per_page);
        this.root_scrollbar__wrap.scrollTop = this.pagination.per_page * 34;
      }
      if (entry.target.id == 'lastItemTrigger' && entry.isIntersecting && this.pagination.next_page_url) {
        this.pagination.currentPage.bottom++;
        await this.fetchEntries(this.pagination.currentPage.bottom, 'end');
        if (this.pagination.currentPage.bottom - this.pagination.currentPage.top > 1) {
          this.removeItemFromTop(this.pagination.per_page);
          this.pagination.currentPage.top++;
        }
      }
    }
  }

  removeItemFromBottom(numberOfItem: number) {
    this.entities.splice(numberOfItem * 2, 999);
  }

  removeItemFromTop(numberOfItem: number) {
    this.entities.splice(0, numberOfItem);
  }

  apiEndpoint(page: number): string {
    let api = this.endPoint.startsWith('/') ? this.endPoint : '/'.concat(this.endPoint);
    api = api.includes('?') ? api.concat(`&page=${page}`) : api.concat(`?page=${page}`);
    return api.concat(`&${this.searchableKey}=${this.query}`);
  }

  get hasCreateSlot(): boolean {
    return !!this.$scopedSlots.createModal;
  }

  remoteMethod(query: string) {
    this.query = query;
    this.fetchOnChangeQuery();
  }

  onClickCreate() {
    this.isActive = true;
    this.$emit('input', this.multiple ? [] : null);
    (this.$refs.elselect as ElSelect).blur();
  }

  async fetchOnChangeQuery() {
    this.pagination.currentPage.top = 1;
    this.pagination.currentPage.bottom = 1;
    this.root_scrollbar__wrap.scrollTop = 0;
    await this.disconnectObserver();
    await this.fetchEntries(1, 'override');
  }

  async disconnectObserver() {
    await this.observer.disconnect();
    this.observing = false;
  }

  clear() {
    this.$parent.$emit('input', this.multiple ? [] : null);
    this.$emit('input', this.multiple ? [] : null);
  }

  change(evt: any) {
    this.$parent.$emit('change', evt);
    this.$emit('change', evt);

    let data = this.entities.find(value => value[this.itemValue] == evt) || null;

    if (Array.isArray(evt)) {
      data = this.entities.filter((value, index, array) => {
        return evt.find(v => v == value[this.itemValue])
      })
    }

    this.$parent.$emit('selected-item', data);
    this.$emit('selected-item', data);
  }

  removeTag(evt: any) {
    this.$parent.$emit('remove-tag', evt);
    this.$emit('remove-tag', evt);
  }

  click(evt: any) {
    this.$parent.$emit('click', evt);
    this.$emit('click', evt);
  }

  resolveNesting(accessor: string, entity: any) {
    let accessorArray = accessor.split('.');
    let currentObjState = entity;
    for (var i = 0; i < accessorArray.length; i++) {
      currentObjState = currentObjState[accessorArray[i]];
    }
    return currentObjState;
  }
}
</script>
<style>
#firstItemTrigger {
  max-height: 1px;
  min-height: 1px;
  position: relative;
  top: 50px;
  visibility: hidden;
}

#lastItemTrigger {
  max-height: 1px;
  min-height: 1px;
  position: relative;
  top: -50px;
  visibility: hidden;
}

.create-button {
  cursor: pointer;
}
</style>
