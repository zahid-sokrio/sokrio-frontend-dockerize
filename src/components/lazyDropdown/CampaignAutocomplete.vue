<template>
    <lazy-dropdown :value="value" label="Merchandise" @input="$emit('input',$event)" searchable-key="name" end-point="campaign-items" resource-key="campaignItems">
        <template v-slot:createModal="{isActive, afterCreated}">
            <campaign-form @created="afterCreated($event)" :is-active.sync="isActive"></campaign-form>
        </template>
    </lazy-dropdown>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Component, Mixins} from "vue-property-decorator";
    import LazyDropdown from "../LazyDropdown.vue";
    import DropdownField from "../../mixins/DropdownField";
    import CampaignForm from "@/views/inspection/campaign/CampaignForm.vue"
    @Component({
        components: {
            LazyDropdown,
            CampaignForm
        }
    })
    export default class CampaignAutocomplete extends Mixins(DropdownField) {
    }
</script>
