import Node from './node'
import ContextMenu from './conextmenu'

class Tree {
  constructor (root) {
    this._ref = root
    this._root = null
    this._stack = []
    this._nodes = []
    this.build()
    this.use(ContextMenu)
  }
  build () {
    this._root = new Node(this._ref)
    this._stack.push(this._root)
    while (this._stack.length) {
      const node = this._stack.pop()
      this._nodes.push(node)
      const orig = node.ref()
      if (orig.children && orig.children.length) {
        for (let i = 0; i < orig.children.length; i++) {
          const child = new Node(orig.children[i])
          child.setParent(node)
          node.children.push(child)
          this._stack.push(child)
        }
      }
    }
    return this
  }
  root () {
    return this._root
  }
  nodes () {
    return this._nodes
  }
  search (name) {
    return this._nodes.filter(item => {
      return item.name.includes(name)
    })
  }
  find (key, val) {
    return this._nodes.filter(item => {
      return Object.keys(item).indexOf(key) > -1 ? item[key].includes(val) : false
    })
  }
  index (nodeId) {
    let index = -1
    for (let i = 0; i < this._nodes.length; i++) {
      if (nodeId === this._nodes[i].id()) {
        index = i
        break
      }
    }
    return index
  }
  addNode (parentId, option) {
    const nodes = this.find('_id', parentId)
    if (nodes.length > 0) {
      const node = new Node(option)
      const r = nodes[0].addChild(node) ? this._nodes.push(node) : 'Adding new node failed'
      return r
    }
    return 'Parent node not found'
  }
  addChildren (parentId, options) {
    options.map(option => {
      this.addNode(parentId, option)
    })
  }
  delNode (nodeId) {
    const node = this.find('_id', nodeId)
    const r = node.getParent().delChild(nodeId) ? this._nodes.splice(this.index(nodeId)) : 'Deleting node failed'
    return r
  }
  addNodeProperties (name, defaultValue, stats, icons) {
    this._nodes.map(item => {
      item.set(name, defaultValue)
      item.set(name + '_stats', stats)
      item.set(name + '_icons', icons)
    })
  }
  update (options) {
  }
  unSelectAll () {
    this.nodes().map(node => {
      node.unselect()
    })
  }
  use (plugin) {
    plugin.install(this)
  }
}

export default Tree
