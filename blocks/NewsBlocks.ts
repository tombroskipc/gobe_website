import type { Block } from "payload";

export const LeadBlock: Block = {
  slug: "lead",
  labels: {
    singular: "Lead section",
    plural: "Lead sections",
  },
  fields: [
    {
      name: "kicker",
      type: "text",
      defaultValue: "GoBeyond News",
    },
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
  ],
};

export const BodyCopyBlock: Block = {
  slug: "bodyCopy",
  labels: {
    singular: "Body copy",
    plural: "Body copy",
  },
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
      admin: {
        description: "Rich text: headings, lists, links, bold/italic, quotes — like a WordPress editor.",
      },
    },
  ],
};

export const FeatureImageBlock: Block = {
  slug: "featureImage",
  labels: {
    singular: "Feature image",
    plural: "Feature images",
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};

export const PullQuoteBlock: Block = {
  slug: "pullQuote",
  labels: {
    singular: "Pull quote",
    plural: "Pull quotes",
  },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "attribution",
      type: "text",
    },
  ],
};

export const StatsGridBlock: Block = {
  slug: "statsGrid",
  labels: {
    singular: "Stats grid",
    plural: "Stats grids",
  },
  fields: [
    {
      name: "items",
      type: "array",
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
        },
        {
          name: "label",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};

export const ChecklistBlock: Block = {
  slug: "checklist",
  labels: {
    singular: "Checklist",
    plural: "Checklists",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};

export const CTABlock: Block = {
  slug: "cta",
  labels: {
    singular: "Call to action",
    plural: "Calls to action",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
    },
    {
      name: "label",
      type: "text",
      defaultValue: "Contact GoBeyond",
      required: true,
    },
    {
      name: "href",
      type: "text",
      defaultValue: "/#contact",
      required: true,
    },
  ],
};

export const ReusableCtaBlock: Block = {
  slug: "reusableCta",
  labels: {
    singular: "Reusable CTA",
    plural: "Reusable CTAs",
  },
  fields: [
    {
      name: "cta",
      type: "relationship",
      relationTo: "reusable-ctas",
      required: true,
      admin: {
        description: "Pick a shared CTA. Edit it once in Reusable CTAs and every post updates.",
      },
    },
  ],
};

export const newsBlocks = [
  LeadBlock,
  BodyCopyBlock,
  FeatureImageBlock,
  PullQuoteBlock,
  StatsGridBlock,
  ChecklistBlock,
  CTABlock,
  ReusableCtaBlock,
];
