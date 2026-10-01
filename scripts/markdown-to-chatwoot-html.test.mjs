import assert from "node:assert/strict";
import test from "node:test";
import { markdownToChatwootHtml } from "./markdown-to-chatwoot-html.mjs";

test("renders inline bold and keeps placeholders untouched", () => {
  assert.equal(
    markdownToChatwootHtml("Dear {{contact.first_name}},\n\n**Option 1:** keep it."),
    "<p>Dear {{contact.first_name}},</p>\n<p><strong>Option 1:</strong> keep it.</p>",
  );
});

test("distributes bold that wraps a multi-line list into each line", () => {
  const markdown = "**Please make sure to:\n- Clearly write your order number.\n- Share the tracking number.**";

  assert.equal(
    markdownToChatwootHtml(markdown),
    '<p><strong>Please make sure to:</strong></p>\n<ul><li><strong>Clearly write your order number.</strong></li><li><strong>Share the tracking number.</strong></li></ul>',
  );
});

test("renders unordered and ordered lists", () => {
  assert.equal(
    markdownToChatwootHtml("- one\n- two\n\n1. first\n2. second"),
    "<ul><li>one</li><li>two</li></ul>\n<ol><li>first</li><li>second</li></ol>",
  );
});

test("keeps single newlines inside a paragraph as line breaks", () => {
  assert.equal(
    markdownToChatwootHtml("Receiver name: GB return\n(+84) 974981088\nCountry: Vietnam"),
    "<p>Receiver name: GB return<br>(+84) 974981088<br>Country: Vietnam</p>",
  );
});

test("escapes raw html in the source", () => {
  assert.equal(markdownToChatwootHtml("<script>alert(1)</script>"), "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
});

test("renders markdown links and autolinks bare urls", () => {
  assert.equal(
    markdownToChatwootHtml("See [policy](https://2tactic.com/pages/refund-policy) or https://gobe.asia now."),
    '<p>See <a href="https://2tactic.com/pages/refund-policy">policy</a> or <a href="https://gobe.asia">https://gobe.asia</a> now.</p>',
  );
});

test("renders headings and inline code", () => {
  assert.equal(markdownToChatwootHtml("## Refunds\n\nUse `RMA-123`."), "<h2>Refunds</h2>\n<p>Use <code>RMA-123</code>.</p>");
});
