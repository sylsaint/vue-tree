<template>
  <div class="vue-tree">
    <tree-node :root="rootNode"></tree-node>
    <context-menu :actions="contextAction"></context-menu>
  </div>
</template>
  
<script>
import Vue from 'vue'
import Tree from '../tree'
import TreeNode from './node.vue'
import ContextMenu from './contextmenu.vue'
import clickoutside from '../clickoutside'
Vue.directive('clickoutside', clickoutside)
export default {
  name: 'VueTree',
  components: { TreeNode, ContextMenu },
  props: {
    root: {
      type: Object,
      default: {}
    },
    options: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      tree: {},
      rootNode: {},
      self: this,
      contextAction: ['add', 'delete']
    }
  },
  computed: {
    loaded () {
      return Object.keys(this.tree) > 0
    }
  },
  watch: {
    root: {
      deep: true,
      handler () {
        this.tree.update(this.root)
      }
    }
  },
  methods: {
  },
  created () {
    this.tree = new Tree(this.root)
    this.rootNode = this.tree.root()
    this.$refs.tree = this.tree
  },
  mounted () {
  }
}
</script>

<style>
    .vue-tree > .tree-node > .node::before {
      width: 0px;
      border-top: none;
    }
    * {
        box-sizing: border-box;
    }
</style>
