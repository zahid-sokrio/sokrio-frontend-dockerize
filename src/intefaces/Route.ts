interface Route {
  path: string;
  name: string;
  redirect: string;
  components: object;
  children: Array<{
    path: string;
    name: string;
    component: any;
    label: string;
    icon: string;
  }>;
}
export default Route;
