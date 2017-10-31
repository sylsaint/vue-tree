<template>
  <div>
    <vue-tree :root="options"></vue-tree> 
    <div>
      <input type="button" value="增加节点" @click="addNode">
      <input type="button" value="删除节点" @click="delNode">
    </div>
  </div>
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
  methods: {
    addNode () {
      this.options.children.push({name: Math.random() * 100})
    },
    delNode () {
      this.options.children.splice(this.options.children.length - 1, 1)
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
