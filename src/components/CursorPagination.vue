<template>
  <div class="d-block mx-auto p-4">
    <base-input group class="mb-3">
      <div class="input-group-prepend">
        <button
          @click="prevPage"
          :disabled="!prevPageCursor || disabled"
          class="btn btn-outline-primary"
          type="button">
          <i class="ni ni-bold-left"></i>
          Previous Page
        </button>
      </div>
<!--      <input type="text" disabled class="form-control text-center" :placeholder="`Current Page: ${value}`">-->
      <div class="input-group-append">
        <button
          @click="nextPage"
          :disabled="!nextPageCursor || disabled"
          class="btn btn-outline-primary"
          type="button">
          Next Page
          <i class="ni ni-bold-right"></i>
        </button>
      </div>
    </base-input>
  </div>
</template>


<script>
import { ButtonGroup, Button } from 'element-ui';

export default {
  name: 'cursor-pagination',
  components: {
    [ButtonGroup.name]: ButtonGroup,
    [Button.name]: Button,
  },
  props: {
    nextPageCursor: {
      type: String,
      default: null,
      description:
        'Next page Cursor'
    },
    prevPageCursor: {
      type: String,
      default: null,
      description:
        'Previous page Cursor'
    },
    value: {
      type: String,
      default: null,
      description: 'Pagination current Cursor'
    },
    align: {
      type: String,
      default: '',
      description: 'Pagination alignment (e.g center|start|end)'
    },
    disabled: {
      type: Boolean,
      default: false,
      description: 'Pagination enabled or disabled'
    }
  },
  data() {
    return {
      defaultPagesToDisplay: 5
    };
  },
  methods: {
    nextPage() {
      this.$emit('input', this.nextPageCursor);
    },
    prevPage() {
      this.$emit('input', this.prevPageCursor);
    }
  }
};
</script>
