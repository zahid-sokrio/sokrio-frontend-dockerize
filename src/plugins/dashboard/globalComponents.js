import Badge from '@/components/argon-core/Badge.vue';
import BaseAlert from '@/components/argon-core/BaseAlert';
import BaseButton from '@/components/argon-core/BaseButton.vue';
import BaseCheckbox from '@/components/argon-core/Inputs/BaseCheckbox.vue';
import BaseDropdown from '@/components/argon-core/BaseDropdown.vue';
import BaseHeader from '@/components/argon-core/BaseHeader';
import BaseInput from '@/components/argon-core/Inputs/BaseInput.vue';
import BaseNav from '@/components/argon-core/Navbar/BaseNav';
import BasePagination from '@/components/argon-core/BasePagination';
import BaseProgress from '@/components/argon-core/BaseProgress';
import BaseRadio from '@/components/argon-core/Inputs/BaseRadio';
import BaseSwitch from '@/components/argon-core/BaseSwitch.vue';
import Card from '@/components/argon-core/Cards/Card.vue';
import Modal from '@/components/argon-core/Modal.vue';
import RouteBreadcrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
import StatsCard from '@/components/argon-core/Cards/StatsCard.vue';
import { Input, Tooltip, Popover } from 'element-ui';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize
} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import Vue from 'vue';

import './full-calendar';
import './world-map';
import FilterDrawerComponent from "../../components/FilterDrawerComponent";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

Vue.component(Badge.name, Badge);
Vue.component(BaseAlert.name, BaseAlert);
Vue.component(BaseButton.name, BaseButton);
Vue.component(BaseCheckbox.name, BaseCheckbox);
Vue.component(BaseHeader.name, BaseHeader);
Vue.component(BaseInput.name, BaseInput);
Vue.component(BaseDropdown.name, BaseDropdown);
Vue.component(BaseNav.name, BaseNav);
Vue.component(BasePagination.name, BasePagination);
Vue.component(BaseProgress.name, BaseProgress);
Vue.component(BaseRadio.name, BaseRadio);
Vue.component(BaseSwitch.name, BaseSwitch);
Vue.component(Card.name, Card);
Vue.component(Modal.name, Modal);
Vue.component(FilterDrawerComponent.name,FilterDrawerComponent)
Vue.component(StatsCard.name, StatsCard);
Vue.component(RouteBreadcrumb.name, RouteBreadcrumb);
Vue.component(Input.name, Input);
Vue.component('validation-provider', ValidationProvider);
Vue.component('validation-observer', ValidationObserver);
Vue.use(Tooltip);
Vue.use(Popover);
