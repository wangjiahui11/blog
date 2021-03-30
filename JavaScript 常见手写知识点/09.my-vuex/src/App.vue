<template>
  <div id="app">
    <h1>{{getState}}</h1>
    <br/>
    <button @click='clickMe'>点击调用dispatch</button>
  </div>
</template>
<script>
export default {
  computed: {
    getState() {
      console.log(this.$store);
      return this.$store.getters.getText;
    }
  },
  mounted() {
    setTimeout(() => {
      // this.$store.state.text  = 'will'
      // 修改store的操作;
      this.$store.commit('syncSetText','will')
    }, 2000);
  },
  methods: {
    clickMe() {
      this.$store.dispatch("asyncSetText", "异步更改数据");
    }
  }
};
</script>