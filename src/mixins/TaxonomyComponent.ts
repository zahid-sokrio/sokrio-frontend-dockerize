import { Component, Prop, Vue } from 'vue-property-decorator';
import Taxonomy from "@/intefaces/Taxonomy";
import TaxonomyJson from "@/assets/json/Taxonomy.json";

// @ts-ignore
@Component
abstract class TaxonomyComponent extends Vue {
    public getTaxonomy(label: any = null) {
        let currentLabel: any = '';
        let taxonomy = this.$store.getters['Settings/getTaxonomyStore'];
        let taxonomyArray: Taxonomy[] = [];
        if(taxonomy) {
            taxonomyArray = typeof taxonomy == 'string' ? JSON.parse(taxonomy) : taxonomy;
        } else {
            taxonomyArray = TaxonomyJson;
        }
        taxonomyArray.forEach((taxonomy: any) => {
            if (Object.keys(taxonomy)[0] == label) {
                currentLabel = Object.values(taxonomy)[0]
            }
        });
        return currentLabel;
    }

    created() {
        this.getTaxonomy()
    }
}

// @ts-ignore
@Component
//@ts-ignore
export default class TaxonomyMixin extends TaxonomyComponent {}
