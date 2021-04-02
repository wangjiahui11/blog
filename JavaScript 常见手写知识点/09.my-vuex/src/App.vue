<template>
  <div id="app">
    <h1>{{getState}}</h1>
    <p>辅助函数获取:{{name}}</p>
    <button @click='clickMe'>点击调用dispatch</button>
  </div>
</template>
<script>
 import { mapState } from "./js/my-vuex.js"
console.log(mapState);
export default {
  computed: {
    getState() {
      return this.$store.getters.getText;
    },
    ...mapState([
      // 映射 this.count 为 store.state.name
      'name'
    ]),

  },
  mounted() {
    setTimeout(() => {
      // this.$store.state.text  = 'will'
      // 修改store的操作;
      this.$store.commit('syncSetText','will')
    }, 2000);
    // console.log(mapState,'mapState----------------');
  },
  methods: {
    clickMe() {
      this.$store.dispatch("asyncSetText", "异步更改数据");
    }
  }
};
</script>