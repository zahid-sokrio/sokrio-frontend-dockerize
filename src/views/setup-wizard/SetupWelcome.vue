<template>
    <div>
        <div class="row justify-content-center">
<!--            <img :src="`${$cdn}/img/welcome.png`">-->
            <h1> Welcome, {{userName}} </h1>
        </div>
        <div class="row justify-content-center">
            <h4>It's great to have you onboard. In just a few steps, you'll be set-up and ready to use your system.</h4>
        </div>
        <div class="row m-2">
            <div class="col-md-4 ">
                <img :src="`${$cdn}/img/welcome.png`" style="float: right">
            </div>
            <div class="col-md-8 border shadow mt-4">
                <div class="timeline timeline-one-side mt-3" data-timeline-axis-style="dashed" data-timeline-content="axis">
                    <div class="timeline-block">
                        <span class="timeline-step badge-success">
                         <i class="fas fa-map"></i>
                        </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Set-up Territory Structure</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">You'll be able to manage territory structure for your organization.</h6>
                        </div>
                    </div>
                    <div class="timeline-block">
                        <span class="timeline-step badge-success">
                         <i class="ni ni-shop"></i>
                        </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Set-up Distribution Structure</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">Create and manage distribution structure for your organization.</h6>
                        </div>
                    </div>
                    <div class="timeline-block">
                        <span class="timeline-step badge-success">
                         <i class="fas fa-user-tie"></i>
                        </span>
                        <div class="timeline-content">
                            <div class="d-flex justify-content-between pt-1">
                                <div>
                                    <span class="text-muted text-sm font-weight-bold">Set-up Role Structure</span>
                                </div>
                            </div>
                            <h6 class="text-sm mt-1 mb-0">Setup employee's role/designation for your organization.</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-4 p-1 text-center">
            <div class=" col-md-8 shadow" style="background: #e8ebed; border: 1px dashed #adb5bd ">
                <h5> <b> Note:</b> You can edit your configured structure, from the system whenever you needed. </h5>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class SetupWelcome extends Vue{

        get userName(){
           var user: any = localStorage.getItem('user');
           var name = JSON.parse(user);
           return name.name;
        }
    }
</script>
