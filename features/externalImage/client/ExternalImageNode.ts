"use client";

import { $applyNodeReplacement, type LexicalNode } from "lexical";
import {
  $isExternalImageServerNode,
  ExternalImageServerNode,
  type ExternalImageData,
  type SerializedExternalImageNode,
} from "../server/ExternalImageNode";

export class ExternalImageNode extends ExternalImageServerNode {
  static clone(node: ExternalImageNode): ExternalImageNode {
    return new this({
      data: node.__data,
      format: node.__format,
      key: node.__key,
    });
  }

  static getType() {
    return ExternalImageServerNode.getType();
  }

  static importJSON(serializedNode: SerializedExternalImageNode): ExternalImageNode {
    const node = $createExternalImageNode({
      data: {
        alt: serializedNode.alt,
        height: serializedNode.height,
        src: serializedNode.src,
        title: serializedNode.title,
        width: serializedNode.width,
      },
    });

    node.setFormat(serializedNode.format || "");

    return node;
  }

  decorate() {
    return null;
  }

  exportJSON() {
    return super.exportJSON();
  }
}

export function $createExternalImageNode({ data }: { data: ExternalImageData }) {
  return $applyNodeReplacement(new ExternalImageNode({ data }));
}

export function $isExternalImageNode(node: LexicalNode | null | undefined): node is ExternalImageNode {
  return $isExternalImageServerNode(node);
}
