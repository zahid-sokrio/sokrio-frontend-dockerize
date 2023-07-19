<script >
    import { Pie, mixins } from 'vue-chartjs';

    export default{
        name: 'base-pie-chart',
        extends: Pie,
        props: {
            chartData: {
                type: Object,
            },
        },
        mounted () {
            this.renderChart(this.chartData, {responsive: true, legend: false, maintainAspectRatio: false, onClick:this.handle})
        },
        methods: {
            handle (point, event) {
                this.$emit('onReceive', event[0]._index)
            }
        }
    }
</script>
