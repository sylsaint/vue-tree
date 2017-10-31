import _ from 'lodash'
import Node from './node'
import ContextMenu from './conextmenu'
import {editDistance} from './levenshtein'

class Tree {
  constructor (root) {
    this._ref = root
    this._root = null
    this._stack = []
    this._nodes = []
    this.build()
    this.use(ContextMenu)
  }
  _build (root) {
    let _root = new Node(root)
    this._stack.push(_root)
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
    return _root
  }
  build () {
    this._root = this._build(this._ref)
  }
  rebuild () {
    this._nodes = []
    this.build()
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
  delNode (node) {
    console.log(node)
    const r = node.getParent().delChild(node.id()) ? this._nodes.splice(this.index(node.id())) : 'Deleting node failed'
    return r
  }
  addNodeProperties (name, defaultValue, stats, icons) {
    this._nodes.map(item => {
      item.set(name, defaultValue)
      item.set(name + '_stats', stats)
      item.set(name + '_icons', icons)
    })
  }
  addNodes (nodeId, nodeArray) {
    const [refNode] = this.find('_id', nodeId)
    if (_.isArray(nodeArray) && nodeArray.length) {
      for (let i = 0; i < nodeArray.length; i++) {
        refNode.addChild(new Node(nodeArray[i]))
      }
    } else if (_.isObject(nodeArray)) {
      refNode.addChild(new Node(nodeArray))
    } else {
      console.log(nodeArray, 'invalid, should be array/object')
    }
    return refNode
  }
  update (root) {
    console.log(this._root, root)
    let nodeQueue = []
    let delQueue = []
    let insQueue = []
    let left = []
    let right = []
    nodeQueue.push({left: this._root, right: root})
    while (nodeQueue.length) {
      let parent = nodeQueue.shift()
      console.log(parent.left, parent.right)
      left = parent.left.children
      right = parent.right.children
      if (this._bad(right)) {
        right = []
      }
      const r = editDistance(left, right, this.costFunc)
      for (let i = 0; i < r.DEL.length; i++) {
        delQueue.push({node: left[r.DEL[i]], parent: parent.left})
      }
      for (let i = 0; i < r.INS.length; i++) {
        insQueue.push({data: right[r.INS[i]], parent: parent.left})
      }
      for (let i = 0; i < r.SUB.length; i++) {
        insQueue.push({data: right[r.SUB[i][1]], parent: parent.left})
        delQueue.push({node: left[r.SUB[i][0]], parent: parent.left})
      }
      for (let i = 0; i < r.SAME.length; i++) {
        nodeQueue.push({left: left[r.SAME[i][0]], right: right[r.SAME[i][1]]})
      }
      console.log(nodeQueue.length)
    }
    this._add(insQueue)
    this._del(delQueue)
  }
  _bad (a) {
    if (!a) {
      return true
    }
    return false
  }
  costFunc (a, b) {
    if (a.ref().name === b.name) {
      return 0
    }
    return 1
  }
  _del (delQueue) {
    while (delQueue.length) {
      const info = delQueue.shift()
      this.delNode(info.node)
    }
    delQueue = []
  }
  _add (insQueue) {
    while (insQueue.length) {
      const info = insQueue.shift()
      const node = this._build(info.data)
      info.parent.addChild(node)
    }
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
