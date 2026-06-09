export const GET = () =>
  Response.json({ error: "GraphQL playground is disabled." }, { status: 404 });
