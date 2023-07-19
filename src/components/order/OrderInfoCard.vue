<template>
        <!-- Card body -->
            <div class="timeline timeline-one-side" data-timeline-content="axis" data-timeline-axis-style="dashed">
                <div v-for="event in events"
                     :key="event.title"
                     class="timeline-block">
          <span class="timeline-step" :class="`badge-${event.type}`">
            <i :class="event.icon"></i>
          </span>
                    <div class="timeline-content">
                        <div class="d-flex justify-content-between pt-1">
                            <div>
                                <span class="text-muted text-sm font-weight-bold">{{event.label}}</span>
                            </div>
                        </div>
                        <h6 class="text-sm mt-1 mb-0">{{event.name}}</h6>
                    </div>
                </div>
            </div>
</template>
<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    @Component({
        name: 'OrderInfoCard',
    })
    export default class OrderInfoCard extends Vue{
        @Prop() currentOrderDetails!: any;

        private events: any = [
            {
                label: 'Outlet',
                name: 'name',
                icon: 'ni ni-bell-55',
                type: 'success',
            },
            {
                label: 'Expected Delivery Date',
                name: this.currentOrderDetails.expected_delivery_date,
                icon: 'ni ni-html5',
                type: 'danger',
            },
            {
                label: 'Created At',
                name: this.currentOrderDetails.created_at,
                icon: 'ni ni-like-2',
                type: 'info'
            }
        ]
    }
</script>
