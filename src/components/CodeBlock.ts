import { Node, mergeAttributes } from '@tiptap/core';

const CodeBlock = Node.create({
  name: 'codeBlock',

  group: 'block',

  content: 'text*',

  marks: '',

  code: true,

  defining: true,

  parseHTML() {
    return [
      { tag: 'pre' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(HTMLAttributes), ['code', 0]];
  },

  addCommands() {
    return {
      setCodeBlock: () => ({ commands }) => {
        return commands.setNode(this.name);
      },
    };
  },
});


export default CodeBlock