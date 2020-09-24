export default function ownerDocument(node: HTMLElement): Document {
  return (node && node.ownerDocument) || document;
}
