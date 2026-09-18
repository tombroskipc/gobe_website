"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import { ExternalImageNode } from "./ExternalImageNode";

export const ExternalImageFeatureClient = createClientFeature({
  nodes: [ExternalImageNode],
});
