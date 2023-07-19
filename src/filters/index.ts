import Vue from 'vue';

function builder(elements: Array<any>, parentId: number | null = null): Array<any> {
  let branch: any[] = [];
  elements.forEach((value, index) => {
    if (value.parent_id == parentId) {
      let children = builder(elements, value.id);
      if (children) {
        value.children = children;
      }
      branch.push(value);
    }
  });
  return branch;
}

Vue.filter('parentTreeBuilder', function(elements: Array<any>) {
  return builder(elements);
});

Vue.filter('sortBy', function(elements: Array<any>, key: string = 'id', order: string = 'asc') {
  // @ts-ignore
  return elements[key]>=elements[key];
});
