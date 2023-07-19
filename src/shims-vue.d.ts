import ConfirmationOptions from '@/intefaces/ConfirmationOptions';

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

import Vue from 'vue';
// @ts-ignore
import Sidebar from '@/components/argon-core/SidebarPlugin';
import User from './intefaces/User';
import { AxiosInstance } from 'axios';

declare module 'vue/types/vue' {
    interface Vue {
        $sidebar: Sidebar;
        $user: User;
        $http: AxiosInstance;
        $api: any;
        $api2: (endpoint: string) => string;
        $api3: (endpoint: string) => string;
        $cdn: any;
        $appBaseUrl: string;
        $landLordApi: (endpoint: string, withoutSuffix?: boolean) => string;
        $hasRole: (role: string) => boolean;
        $hasPermission: (permission: string) => boolean;
        $blob2Url: (url: string) => Promise<string>;
        $blob2UrlForLandlord: (url: string) => Promise<string>;
        $getFileNameFromContentDisposition: (contentDisposition: string) => string;
        $currency: () => string;
        $conformation: (value: ConfirmationOptions) => void;
        $toQueryString: (obj: any) => string;
    }
}
