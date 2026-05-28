# Errors

Command failures and integration errors.

---

## [ERR-20260528-001] Payload CLI import/runtime gotchas

**Logged**: 2026-05-28T04:05:00+07:00
**Area**: cms

### Summary
`payload generate:types` does not load this repo's `@/*` app alias from `payload.config.ts`, and Lexical rich text pulled top-level-await modules that broke Payload's CJS config loader.

### Details
Use relative imports inside Payload config/collection files. For this project, the news template feature was implemented with Payload Blocks and textarea copy blocks instead of Lexical rich text so type generation and builds stay stable.
