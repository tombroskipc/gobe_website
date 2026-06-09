export const POST = () =>
  Response.json({ error: "GraphQL is disabled." }, { status: 404 });
