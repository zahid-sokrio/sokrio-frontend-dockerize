<template>
    <lazy-dropdown :label="label" :placeholder="placeholder" :name="name" :value="value" @input="$emit('input',
    $event)" searchable-key="name" end-point="transports" resource-key="transports" :rules="rules">
        <template v-slot:createModal="{isActive, afterCreated}">
          <CreateTransportForm v-if="isActive" @created="afterCreated($event)" :is-active.sync="isActive"></CreateTransportForm>
        </template>
    </lazy-dropdown>
</template>
<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import LazyDropdown from "../LazyDropdown.vue";
    import DropdownField from "../../mixins/DropdownField";
    import CreateTransportForm from "@/views/user/transport/CreateTransportForm.vue";
    @Component({
        components: {
          LazyDropdown,
          CreateTransportForm,

        }
    })
    export default class TransportLazydropdown extends Mixins(DropdownField) {
    }
</script>
