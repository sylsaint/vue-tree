<template>
  <div class="tree-node">
    <div class="node">
      <span class="icon" @click="handleFold">
        <i class="fa" :class="iconClass"></i>
      </span>
      <span class="name" :class="isSelected" @click="handleSelect" @contextmenu.prevent="handleContext">{{name}}</span>
    </div>
    <div class="children" v-if="hasChildren && isOpen">
      <Tree-node v-for="(node, key) in root.children" :root="node" :key="node.id()"></Tree-node>
    </div>
  </div> 
</template>

<script>
import {getOffset} from '../util'
export default {
  name: 'TreeNode',
  props: {
    root: {
      type: Object,
      default: {}
    }
  },
  computed: {
    name () {
      return this.root.name ? this.root.name() : '未知'
    },
    hasChildren () {
      return this.root.children
    },
    isOpen () {
      return this.root.open
    },
    iconClass () {
      return this.root.open ? 'fa-folder-open-o' : 'fa-folder-o'
    },
    isSelected () {
      return this.root.selected ? 'selected' : ''
    }
  },
  methods: {
    handleFold () {
      if (this.root.open) {
        this.root.fold()
      } else {
        this.root.unfold()
      }
    },
    handleSelect () {
      this.$refs.tree.unSelectAll()
      if (!this.root.selected) {
        this.root.select()
      }
    },
    handleContext (e) {
      this.$refs.tree.contextmenu.emit({event: e, offset: getOffset(this.$el), target: this.root})
      this.$emit('contextmenu-update')
    }
  },
  created () {
    this.$refs.tree = this.$parent.$refs.tree
  },
  mounted () {
    this.self = this.$refs
  }
}
</script>

<style scoped>
  .tree-node {
    position: relative;
    height: auto;
    width: 100%;
    text-align: left;
    color: #333;
  }
  .tree-node:before {
    content: ' ';
    position: absolute;
    left: 10px;
    top: 20px;
    bottom: 10px;
    height: calc(100% - 30px);
    border-left: dotted 1px #333; 
  }
  .tree-node .children {
    position: relative;
    width: 100%;
    left: 20px;
  }
  .node::before {
    content: ' ';
    top: 10px;
    left: -9px;
    position: absolute;
    width: 9px;
    border-top: dotted 1px #333; 
  }
  .node .icon {
    transition: all .2s linear;
    display: inline-block;
    width: 20px;
    height: 20px;
    user-select: none;
    text-align: center;
    cursor: pointer;
  }
  .node .name {
    display: inline-block;
    font-size: 13px;
    height: 20px;
    line-height: 20px;
    max-width: 100px;
    text-overflow: ellipsis;
    cursor: pointer;
    padding: 0 5px;
    user-select: none;
  }
  .node .name:hover, .node .icon:hover {
    color: #57a3f3;
    background-color: #fff;
  }
  .node .name.selected {
    background-color: #dddee1;
    color: #333;
    border-radius: 3px;
  }

</style>
