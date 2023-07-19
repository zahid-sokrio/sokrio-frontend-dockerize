<template>
    <div>
        <img :src="imageSrc" class="productImage" @click="isShowImagePreview = true"/>

        <modal :show.sync="isShowImagePreview" @close="close">
            <div >
                <img :src="imageSrc"  class="modal-content img-fluid"/>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="close">Close</base-button>
            </template>
        </modal>
    </div>
</template>
<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    @Component({
        name: 'SingleImageShow'
    })
    export default class SingleImageShow extends Vue {
        @Prop() image!: any;
        private imageSrc: any = '';
        private hasError: any = false;
        private isShowImagePreview: boolean = false;

        fetchProductImage(image: any) {
            this.$blob2Url(image).then((response:any) => {
                this.imageSrc = response;
            });
        }
        created(){
            this.fetchProductImage(this.image);
        }

        close(){
            this.isShowImagePreview = false;
        }
    }
</script>
<style>
    .productImage{
        height: 80px;
        width: 80px
    }

    .modal-content{
        display: block;
        margin: auto;
        width: 90%;
        height: auto !important;
        object-fit: cover;
    }

</style>
