<template>
    <div>
        <img :src="imageSrc" class="productImage"/>
    </div>
</template>
<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    @Component({
        name: 'ProductImage'
    })
    export default class ProductImage extends Vue {
        @Prop() image!: any;
        private imageSrc: any = '';
        private hasError: any = false;

         fetchProductImage(image: any) {
           if (process.env.NODE_ENV !== 'production') {
             this.$blob2Url(image).then((response:any) => {
               this.imageSrc = response;
             });
           } else {
             this.imageSrc = this.image;
           }
        }
        created() {
            this.fetchProductImage(this.image);
        }
    }
</script>
<style>
    .productImage{
        height: 80px;
        width: 80px
    }
</style>
