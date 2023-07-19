<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row">
                <div class="col-4">
                    <h3 class="mb-0">Add New Promotion</h3>
                </div>
                <div class="col-8 text-right">
                    <router-link to="/product/promotions">
                        <base-button size="sm" type="primary">
                            <span>
                                <i class="el-icon-arrow-left"></i>
                             </span>
                            Back
                        </base-button>
                    </router-link><br>
                    <span class="information"><i class="fas fa-info-circle"></i>
                        {{form.offerType == 'qty' ? 'Buy any' : ''}}
                        {{form.productValue}}
                        {{form.offerType == 'amount' ? 'Tk Discount on' : form.offerType == 'qty' ? 'products from' : form.offerType == 'percent' ? '% Discount on' : ''}}
                        {{ form.type == 'productBrand' && form.productBrand != '' ? productBrands.find(brand => brand.id == form.productBrand).name
                        : form.type == 'productCategory' && form.productCategory != '' ? productCategories.find(category => category.id == form.productCategory).name
                        : form.type == 'singleProduct' && form.singleProduct != '' ? products.find(product => product.id == form.singleProduct).name +' - '+ products.find(product => product.id == form.singleProduct).sku
                        :  ''}}
                        {{ form.type != 'singleProduct' ? promotionTypes.find(type => type.name == form.type).label : '' }}
                        <span v-if="form.offerType == 'qty'">
                            & get
                            {{form.offerValue}}
                            {{form.offerProduct != '' ? products.find(product => product.id == form.offerProduct).name +' - '+ products.find(product => product.id == form.offerProduct).sku : ''}} free
                        </span>
                    </span>
                </div>
            </div>
                <div class="p-1">
                    <validation-observer ref="formValidator" v-slot="{handleSubmit}">
                        <div class="row">
                            <div class="col-md-6">
                                <base-input label="Promotion Title">
                                    <textarea class="form-control" id="promotionTitle" rows="3" resize="none" v-model="form.title"></textarea>
                                </base-input>
                            </div>
                            <div class="col-md-6">
                                <base-input label="Expires At" name="expires_at">
                                    <flat-picker slot-scope="{focus, blur}"
                                                 @on-open="focus"
                                                 @on-close="blur"
                                                 :config="{allowInput: true}"
                                                 class="form-control datepicker"
                                                 v-model="form.date"
                                    >
                                    </flat-picker>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input label="Promotion Type">
                                    <el-select  filterable
                                               placeholder="Type"
                                                v-model="form.type"
                                    >
                                        <el-option v-for="(type,index) in promotionTypes"
                                                   :key="index"
                                                   :label="type.label"
                                                   :value="type.name"
                                                   :selected="index[0]"
                                        >
                                        </el-option>
                                    </el-select>
                                </base-input>
                            </div>
                            <div class="col-md-6">
                                <base-input label="Offer Type">
                                    <el-select  filterable
                                                placeholder="Promotional Type"
                                                v-model="form.offerType"
                                    >
                                        <el-option v-for="(offerType,index) in offerTypes"
                                                   :key="index"
                                                   :label="offerType.label"
                                                   :value="offerType.name"
                                                   :disabled="form.type == 'allProduct' && offerType.name == 'qty' ? true : false"
                                        >
                                        </el-option>
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6" v-if="form.type == 'productBrand'">
                                <base-input label="Product Brand">
                                    <el-select  filterable
                                                placeholder="Type"
                                                v-model="form.productBrand"
                                    >
                                        <el-option v-for="productBrand in productBrands"
                                                   :key="productBrand.id"
                                                   :label="productBrand.name"
                                                   :value="productBrand.id">
                                        </el-option>
                                    </el-select>
                                </base-input>
                            </div>
                            <div class="col-md-6" v-if="form.type == 'productCategory'">
                                <base-input label="Product Category">
                                    <el-select  filterable
                                                placeholder="Type"
                                                v-model="form.productCategory"
                                    >
                                        <el-option v-for="productCategory in productCategories"
                                                   :key="productCategory.id"
                                                   :label="productCategory.name"
                                                   :value="productCategory.id">
                                        </el-option>
                                    </el-select>
                                </base-input>
                            </div>
                            <div class="col-md-6" v-if="form.type == 'singleProduct'">
                                <base-input label="Single Product">
                                    <el-select  filterable
                                                placeholder="Type"
                                                v-model="form.singleProduct"
                                    >
                                        <el-option v-for="product in products"
                                                   :key="product.id"
                                                   :label="product.name + ' - ' + product.sku"
                                                   :value="product.id">
                                        </el-option>
                                    </el-select>
                                </base-input>
                            </div>
                            <div class="col-md-6">
                                <base-input label="Product Value" v-model="form.productValue" style="margin-bottom: 10px"></base-input>
<!--                                <span style="font-size: 13px; color: blue;"><i class="fas fa-info-circle"></i>-->
<!--                                    {{form.promotionalType == 'bundle' ? 'Buy any' : ''}}-->
<!--                                    {{form.productValue}}-->
<!--                                    {{form.promotionalType == 'amount' ? 'tk flat discount on' : form.promotionalType == 'bundle' ? '(qty) products from' : form.promotionalType == 'percent' ? '% discount on' : ''}}-->
<!--                                    {{ form.type != 'allProduct' ? 'selected' : ''}}-->
<!--                                    {{ form.type != '' ? types.find(type => type.name == form.type).label : '' }}-->
<!--                                </span>-->
                            </div>
                            <div class="col-md-6" v-if="form.offerType == 'qty'">
                                <base-input label="Offer Product">
                                    <el-select  filterable
                                                placeholder="Offer Product"
                                                v-model="form.offerProduct"
                                    >
                                        <el-option v-for="product in products"
                                                   :key="product.id"
                                                   :label="product.name + ' - ' + product.sku"
                                                   :value="product.id">
                                        </el-option>
                                    </el-select>
                                </base-input>
                            </div>
<!--                            <div class="col-md-6" v-if="form.offerType == 'qty'">-->
<!--                                <base-input label="Product Offer Type">-->
<!--                                    <el-select  filterable-->
<!--                                                placeholder="Offer Type"-->
<!--                                                v-model="form.productOfferType"-->
<!--                                    >-->
<!--                                        <el-option v-for="(type,index) in promotionalTypes"-->
<!--                                                   :key="index"-->
<!--                                                   :label="type.label"-->
<!--                                                   :value="type.name">-->
<!--                                        </el-option>-->
<!--                                    </el-select>-->
<!--                                </base-input>-->
<!--                            </div>-->
                            <div class="col-md-6" v-if="form.offerType == 'qty'">
                                <base-input label="Offer Value" v-model="form.offerValue"></base-input>
<!--                                <span style="font-size: 13px; color: blue;"><i class="fas fa-info-circle"></i>-->
<!--                                    get {{form.offerValue}} {{form.offerType == 'bundle' ? '(qty) product free' : form.offerType == 'amount' ? 'tk flat discount' : form.offerType == 'percent' ? '% discount' : ''}}-->
<!--                                </span>-->
                            </div>
                            <div class="col-md-6">
                                <label>Image</label>
                                <single-image-uploader
                                        :img.sync="form.image"
                                        image-max-height="100px"
                                        uploadText="Change Promotional Image"
                                ></single-image-uploader>
                            </div>
                            <div class="col-md-6">
                                <base-input label="User">
                                    <el-select  multiple
                                                filterable
                                                placeholder="Type"
                                                v-model="form.users"
                                    >
                                        <el-option v-for="user in users"
                                                   :key="user.id"
                                                   :label="user.name"
                                                   :value="user.id">
                                        </el-option>
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row mr-2" style="float: right">
                            <base-button type="success" @click="handleSubmit(save)">Save</base-button>
                        </div>
                    </validation-observer>
                </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    const flatPicker = require('vue-flatpickr-component');
    // import flatPicker from "vue-flatpickr-component";
    import "flatpickr/dist/flatpickr.css";
    import SingleImageUploader from "@/components/ui/SingleImageUploader.vue";
    import ProductBrandParentLazydropdown from "@/components/lazyDropdown/ProductBrandParentLazydropdown.vue";
    import ProductCategoryParentLazydropdown from "@/components/lazyDropdown/ProductCategoryParentLazydropdown.vue";

    import {
        Dropdown,
        DropdownItem,
        DropdownMenu,
        Tooltip,
    } from 'element-ui';
    import Productable from "@/intefaces/Productable";

    @Component({
        components: {
            [Tooltip.name]: Tooltip,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
            flatPicker,
            SingleImageUploader
        },
    })
    export default class AddPromotion extends Vue{
        private users: any = [];
        private productBrands: Productable[] = [];
        private productCategories: Productable[] = []
        private products: any = [];

        private promotionTypes = [
            {'label':'All Product','name': 'allProduct'},
            {'label': 'Product Brand','name':'productBrand'},
            {'label': 'Product Category','name':'productCategory'},
            {'label': 'Single Product','name':'singleProduct'}
            ]
        private offerTypes = [
            {'label': 'Discount-Amount', 'name':'amount'},
            {'label': 'Quantity', 'name': 'qty'},
            {'label': 'Discount-Percent','name':'percent'}]
        private form = {
            title: '',
            type: 'allProduct',
            date: '',
            users: '',
            offerType: '',
            productValue: '',
            image: '',
            productBrand: '',
            productCategory:'',
            singleProduct: '',
            offerProduct: '',
            offerValue: ''
        }

        createPromotion(){
            this.$http.post(this.$api('/promotions'), {
                title: this.form.title,
                type: this.form.type,
            })
        }

        save(){
            this.createPromotion();
        }

        fetchUser(){
            this.$http.get(this.$api("/users")).then(response => {
                this.users = response.data.users;
            })
        }

        fetchProductBrand(){
            this.$http.get(this.$api("/product-brands")).then(response => {
                this.productBrands = response.data.productBrands;
            })
        }

        fetchProductCategory(){
            this.$http.get(this.$api("/product-categories")).then(response => {
                this.productCategories = response.data.productCategories;
            })
        }

        fetchProduct(){
            this.$http.get(this.$api("/products")).then(response => {
                this.products = response.data.products;
            })
        }

        created(){
            this.fetchUser();
            this.fetchProductBrand();
            this.fetchProductCategory();
            this.fetchProduct();
        }
    }
</script>
<style>
    .information{
        font-size: 14px;
        color: blue
    }
</style>
