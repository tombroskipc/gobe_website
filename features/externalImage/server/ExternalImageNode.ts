import { DecoratorBlockNode, type SerializedDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode.js";
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, type DOMConversionMap, type DOMConversionOutput, type EditorConfig, type ElementFormatType, type LexicalNode } from "lexical";

export type ExternalImageData = {
  alt?: string;
  height?: number;
  src: string;
  title?: string;
  width?: number;
};

export type SerializedExternalImageNode = ExternalImageData &
  SerializedDecoratorBlockNode & {
  type: "externalImage";
  version: 1;
};

const isGoogleDocCheckboxImage = (domNode: HTMLImageElement) =>
  domNode.parentElement?.tagName === "LI" && domNode.previousSibling === null && domNode.getAttribute("aria-roledescription") === "checkbox";

const shouldKeepPayloadUploadImport = (domNode: HTMLImageElement) =>
  domNode.hasAttribute("data-lexical-pending-upload-form-id") ||
  (domNode.hasAttribute("data-lexical-upload-relation-to") && domNode.hasAttribute("data-lexical-upload-id"));

const getDimension = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const getExternalImageData = (domNode: HTMLImageElement): ExternalImageData | null => {
  if (isGoogleDocCheckboxImage(domNode) || shouldKeepPayloadUploadImport(domNode)) {
    return null;
  }

  const src = domNode.getAttribute("src")?.trim();

  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return null;
  }

  return {
    alt: domNode.getAttribute("alt") || undefined,
    height: getDimension(domNode.getAttribute("height")),
    src,
    title: domNode.getAttribute("title") || undefined,
    width: getDimension(domNode.getAttribute("width")),
  };
};

const convertExternalImageElement = (domNode: HTMLImageElement): DOMConversionOutput | null => {
  const data = getExternalImageData(domNode);

  if (!data) {
    return null;
  }

  return {
    node: $createExternalImageServerNode({ data }),
  };
};

export class ExternalImageServerNode extends DecoratorBlockNode {
  __data: ExternalImageData;

  constructor({ data, format, key }: { data: ExternalImageData; format?: ElementFormatType; key?: string }) {
    super(format, key);
    this.__data = data;
  }

  static clone(node: ExternalImageServerNode): ExternalImageServerNode {
    return new this({
      data: node.__data,
      format: node.__format,
      key: node.__key,
    });
  }

  static getType() {
    return "externalImage";
  }

  static importDOM(): DOMConversionMap<HTMLImageElement> {
    return {
      img: () => ({
        conversion: convertExternalImageElement,
        priority: 4,
      }),
    };
  }

  static importJSON(serializedNode: SerializedExternalImageNode): ExternalImageServerNode {
    const node = $createExternalImageServerNode({
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

  createDOM(config?: EditorConfig): HTMLElement {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const data = this.__data;

    addClassNamesToElement(figure, config?.theme?.upload);
    figure.setAttribute("data-lexical-external-image", "true");
    image.setAttribute("src", data.src);
    image.setAttribute("alt", data.alt || "");
    image.style.maxWidth = "100%";
    image.style.height = "auto";

    if (data.title) {
      image.setAttribute("title", data.title);
    }

    if (data.width) {
      image.setAttribute("width", String(data.width));
    }

    if (data.height) {
      image.setAttribute("height", String(data.height));
    }

    figure.appendChild(image);
    return figure;
  }

  decorate() {
    return null;
  }

  exportDOM() {
    const element = document.createElement("img");
    const data = this.__data;

    element.setAttribute("src", data.src);
    element.setAttribute("alt", data.alt || "");

    if (data.title) {
      element.setAttribute("title", data.title);
    }

    if (data.width) {
      element.setAttribute("width", String(data.width));
    }

    if (data.height) {
      element.setAttribute("height", String(data.height));
    }

    return { element };
  }

  exportJSON(): SerializedExternalImageNode {
    return {
      ...super.exportJSON(),
      ...this.getData(),
      type: "externalImage",
      version: 1,
    };
  }

  getData() {
    return this.getLatest().__data;
  }

  getTextContent() {
    return this.__data.alt || this.__data.title || "";
  }

  isInline(): false {
    return false;
  }

  setData(data: ExternalImageData) {
    const writable = this.getWritable();
    writable.__data = data;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createExternalImageServerNode({ data }: { data: ExternalImageData }) {
  return $applyNodeReplacement(new ExternalImageServerNode({ data }));
}

export function $isExternalImageServerNode(node: LexicalNode | null | undefined): node is ExternalImageServerNode {
  return node instanceof ExternalImageServerNode;
}
