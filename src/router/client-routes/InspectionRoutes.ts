import { RouteConfig } from 'vue-router';
// @ts-ignore
import Inspection from '@/views/inspection/Inspection.vue';
// @ts-ignore
import SurveyList from '@/views/inspection/survey/SurveyList.vue';
// @ts-ignore
import SurveyQuestionList from '@/views/inspection/survey/SurveyQuestionList.vue';
// @ts-ignore
import SurveyPage from '@/views/inspection/survey/SurveyPage.vue';
import Survey from '@/intefaces/Survey';
// @ts-ignore
import AssetList from '@/views/inspection/auditable/AssetList.vue';
// @ts-ignore
import AssignAssetList from '@/views/inspection/auditable/AuditableOutletList.vue';
// @ts-ignore
import AssignAudit from '@/views/inspection/auditable/Audit.vue';
// @ts-ignore
import CampaignList from '@/views/inspection/campaign/CampaignList.vue';
// @ts-ignore
import QuestionList from '@/views/inspection/survey/QuestionList.vue';
import { Permission } from "@/enums/Permission";
import { PermissionHelper } from "@/classes/PermissionHelper";

// Redirect to user's authorized (has permission) tab
function redirectToUserAuthorizedRoute() {
    return '/inspection/' + PermissionHelper([
        Permission.VIEW_SURVEY,
        Permission.VIEW_ASSET,
        Permission.VIEW_CAMPAIGN,
        Permission.VIEW_OUTLET_ITEM,
        Permission.VIEW_AUDIT,
        Permission.VIEW_QUESTION,
    ], [{permission: Permission.VIEW_SURVEY, name: 'survey'},
        {permission: Permission.VIEW_ASSET, name: 'assets'},
        {permission: Permission.VIEW_CAMPAIGN, name: 'merchandise'},
        {permission: Permission.VIEW_OUTLET_ITEM, name: 'outlet-items'},
        {permission: Permission.VIEW_AUDIT, name: 'audits'},
        {permission: Permission.VIEW_QUESTION, name: 'questions'},
    ]);
}

const InspectionRoutes: RouteConfig = {
    path: 'inspection',
    name: 'inspection',
    redirect: to => {
        return redirectToUserAuthorizedRoute();
    },
    components: {dashboard: Inspection},
    children: [
        {
            path: '/inspection/survey',
            component: SurveyPage,
            children: [
                {
                    path: '',
                    name: 'survey',
                    components: {surveyPage: SurveyList}
                },
                {
                    path: ':surveyId/questions',
                    name: 'survey-questions',
                    components: {surveyPage: SurveyQuestionList},
                    props: {surveyPage: true}
                }
            ],
            meta: {
                label: 'Survey',
                icon: 'fa fa-podcast',
                permission: Permission.VIEW_SURVEY,
                breadCrumb: 'survey',
            }
        },
        {
            path: '/inspection/assets',
            name: 'assets',
            meta: {
                label: 'Assets',
                icon: 'fas fa-cubes',
                permission: Permission.VIEW_ASSET,
                breadCrumb: 'assets',
            },
            component: AssetList
        },
        {
            path: '/inspection/merchandise',
            name: 'merchandise',
            meta: {
                label: 'Merchandise',
                icon: 'fas fa-swatchbook',
                permission: Permission.VIEW_CAMPAIGN,
                breadCrumb: 'merchandise',
            },
            component: CampaignList
        },
        {
            path: 'outlet-items',
            name: 'outlet-items',
            meta: {
                label: 'Outlet Items',
                icon: 'fas fa-boxes',
                permission: Permission.VIEW_OUTLET_ITEM,
                breadCrumb: 'outlet-items'
            },
            component: AssignAssetList
        },
        {
            path: '/inspection/audits',
            name: 'audits',
            meta: {
                label: 'Audits',
                icon: 'fas fa-table',
                permission: Permission.VIEW_AUDIT,
                breadCrumb: 'audits'
            },
            component: AssignAudit
        },
        {
            path: '/inspection/questions',
            name: 'questions',
            meta: {
                label: 'Questions',
                icon: 'fas fa-question',
                permission: Permission.VIEW_QUESTION,
                breadCrumb: 'questions',
            },
            component: QuestionList
        }
    ]
};
export default InspectionRoutes;
