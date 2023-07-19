import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class DropdownField extends Vue {
  @Prop()
  value!: number | null;
  @Prop({ default: false })
  multiple!: boolean;
  @Prop({ default: false })
  collapseTags!: boolean;
  @Prop({ default: 'Search . . .' })
  placeholder!: string;
  @Prop({ default: null })
  label!: string | null;
  @Prop({ default: null })
  name!: string | null;
  @Prop({ default: false })
  disabled!: boolean;
  @Prop()
  rules!: string;
  @Prop({ default: false })
  createButton!: boolean;
}
