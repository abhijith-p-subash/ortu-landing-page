import React from "react";
import ReactDOMServer from "react-dom/server";
import { routes, resolveRoute } from "./routes";
import "./index.css";

/**
 * Renders one route to HTML. The prerender script calls this once per entry in
 * `getRoutes()` and writes the result to dist/<path>/index.html.
 */
export function render(pathname = "/") {
  const route = resolveRoute(pathname);
  if (!route) {
    throw new Error(`No route registered for "${pathname}"`);
  }

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>{route.element}</React.StrictMode>
  );

  return {
    html,
    title: route.title,
    description: route.description,
    jsonLd: route.jsonLd,
  };
}

/**
 * The route table, minus the React elements, so the build script can enumerate
 * pages without pulling React into its own scope.
 */
export function getRoutes() {
  return routes.map(({ path, title, description, jsonLd }) => ({
    path,
    title,
    description,
    jsonLd,
  }));
}
