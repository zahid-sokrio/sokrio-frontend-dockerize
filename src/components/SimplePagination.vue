<template>
  <div class="d-block mx-auto p-4">
    <base-input group class="mb-3">
      <div class="input-group-prepend">
        <button
          @click="prevPage"
          :disabled="!prevPageUrl || disabled"
          class="btn btn-outline-primary"
          type="button">
          <i class="ni ni-bold-left"></i>
          Previous Page
        </button>
      </div>
      <input type="text" disabled class="form-control text-center" :placeholder="`Current Page: ${value}`">
      <div class="input-group-append">
        <button
          @click="nextPage"
          :disabled="!nextPageUrl || disabled"
          class="btn btn-outline-primary"
          type="button">
          Next Page
          <i class="ni ni-bold-right"></i>
        </button>
      </div>
    </base-input>
    <!--    <el-button-group :disabled="disabled">-->
    <!--      <el-button-->
    <!--        @click="prevPage"-->
    <!--        size="small"-->
    <!--        type="primary"-->
    <!--        :disabled="!prevPageUrl">-->
    <!--        <i class="el-icon-arrow-left"></i>Previous-->
    <!--        Page-->
    <!--      </el-button>-->
    <!--      <el-button-->
    <!--        -->
    <!--        size="small"-->
    <!--        type="primary"-->
    <!--        :disabled="!nextPageUrl">-->
    <!--        Next Page-->
    <!--        <i class="el-icon-arrow-right el-icon&#45;&#45;left"></i>-->
    <!--      </el-button>-->
    <!--    </el-button-group>-->
  </div>
  <!--  <ul-->
  <!--    class="pagination"-->
  <!--    :class="[align && `justify-content-${align}`]"-->
  <!--  >-->
  <!--    <li class="page-item prev-page" :class="{disabled: value === 1 || disabled}">-->
  <!--      <a class="page-link" aria-label="Previous" @click="prevPage">-->
  <!--        <span aria-hidden="true">-->
  <!--          <i class="fa fa-angle-left" aria-hidden="true"></i>-->
  <!--        </span>-->
  <!--      </a>-->
  <!--    </li>-->
  <!--    <li class="page-item next-page" :class="{disabled: value === totalPages || disabled}">-->
  <!--      <a class="page-link" aria-label="Next" @click="nextPage">-->
  <!--        <span aria-hidden="true">-->
  <!--          <i class="fa fa-angle-right" aria-hidden="true"></i>-->
  <!--        </span>-->
  <!--      </a>-->
  <!--    </li>-->
  <!--  </ul>-->
</template>
<script>
import { ButtonGroup, Button } from 'element-ui';

export default {
  name: 'simple-pagination',
  components: {
    [ButtonGroup.name]: ButtonGroup,
    [Button.name]: Button,
  },
  props: {
    nextPageUrl: {
      type: String,
      default: null,
      description:
        'Next page url'
    },
    prevPageUrl: {
      type: String,
      default: null,
      description:
        'Previous page url'
    },
    value: {
      type: Number,
      default: 1,
      description: 'Pagination value'
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
  computed: {
    pagesToDisplay() {
      if (this.totalPages > 0 && this.totalPages < this.defaultPagesToDisplay) {
        return this.totalPages;
      }
      return this.defaultPagesToDisplay;
    },
    minPage() {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage > this.totalPages) {
          return this.totalPages - this.pagesToDisplay + 1;
        }
        return this.value - pagesToAdd;
      } else {
        return 1;
      }
    },
    maxPage() {
      if (this.value >= this.pagesToDisplay) {
        const pagesToAdd = Math.floor(this.pagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage < this.totalPages) {
          return newMaxPage;
        } else {
          return this.totalPages;
        }
      } else {
        return this.pagesToDisplay;
      }
    }
  },
  data() {
    return {
      defaultPagesToDisplay: 5
    };
  },
  methods: {
    range(min, max) {
      let arr = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    },
    nextPage() {
      this.$emit('input', this.value + 1);
    },
    prevPage() {
      if (this.value > 1) {
        this.$emit('input', this.value - 1);
      }
    }
  },
  watch: {
    perPage() {
      if (this.value > 1) {
        this.$emit('input', 1);
      }
    },
    total() {
      if (this.value > 1) {
        this.$emit('input', 1);
      }
    }
  }
};
</script>

<style>
.page-link {
  cursor: pointer !important;
}
</style>
