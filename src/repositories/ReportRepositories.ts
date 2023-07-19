import { Component, Prop, Vue } from 'vue-property-decorator';
import {AxiosResponse} from "axios";
@Component({

})

export default class ReportRepositories extends Vue{

    // @ts-ignore
    async afterCreate(response: AxiosResponse<any>): any;

    // @ts-ignore
   // async getEntity(currentURL: any){
   //     console.log(currentURL);
   //     let response: any = this.$http.get(this.$api(`${currentURL}`));
   //     if(response){
   //         await this.afterCreate(response);
   //     }
   // }

     public getEntity(currentURL: string) {
        console.log(currentURL);
        let response: any = this.$http.get(this.$api(`${currentURL}`));

    }
}
