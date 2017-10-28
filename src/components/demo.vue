<template>
  <vue-tree :root="options"></vue-tree> 
</template>

<script>
import VueTree from './tree.vue'
export default {
  components: { VueTree },
  data () {
    return {
      options: {
        name: '这个是根目录',
        children: [
          {
            name: 'son',
            children: [{ name: 'grandson' }, { name: 'grandaughter' }]
          },
          {
            name: 'daughter'
          }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    console.log(this.treeData)
    console.log(this.$options)
    console.log(this.$el)
  }
}
</script>

<style scoped>

</style>
