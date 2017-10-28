import Tree from '@/tree'
describe('Tree.js', () => {
  it('should build tree with root object', () => {
    const root = {
      name: 'root',
      children: [
        {name: 'son',
          children: [
            { name: 'grandson' },
            { name: 'grandaughter' }
          ]
        },
        {
          name: 'daughter'
        }
      ]
    }
    const tree = new Tree(root)
    expect(tree.nodes().length).to.equal(5)
    const toAddNode = {name: 'son2'}
    const node = tree.nodes()[0]
    tree.addNode(node.id(), toAddNode)
    expect(tree.nodes().length).to.equal(6)
    console.log(tree.nodes()[tree.nodes().length - 1]._data)
    console.log(tree.nodes()[tree.nodes().length - 1].name())
    expect(tree.nodes()[tree.nodes().length - 1].name()).to.equal('son2')
    expect(tree.nodes()[tree.nodes().length - 1].getParent().id()).to.equal(node.id())
  })
})
