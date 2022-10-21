import type { ServeStaticOptions } from './serve-static';
declare const module: (options?: ServeStaticOptions) => (c: import("../..").Context<string, any, import("../../hono").ValidatedData>, next: import("../..").Next) => Promise<Response | undefined>;
export { module as serveStatic };
