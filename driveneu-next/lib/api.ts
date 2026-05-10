import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { logger } from "./logger";
import { getIp, rateLimit } from "./rate-limit";

export type ApiHandler<T> = (ctx: {
  data: T;
  req: Request;
  userId: string;
}) => Promise<unknown> | unknown;

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}
export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export function withApi<T>(opts: {
  schema?: ZodSchema<T>;
  rateLimit?: { limit: number; windowMs: number };
  auth?: boolean;
  handler: ApiHandler<T>;
}) {
  return async (req: Request) => {
    try {
      const ip = getIp(req);
      const rl = opts.rateLimit ?? { limit: 60, windowMs: 60_000 };
      const r = rateLimit(`${ip}:${new URL(req.url).pathname}`, rl.limit, rl.windowMs);
      if (!r.ok) return fail("Rate limit exceeded", 429);

      let userId = "";
      if (opts.auth !== false) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return fail("Unauthorized", 401);
        userId = session.user.id;
      }

      let data: T = undefined as T;
      if (opts.schema) {
        const json = req.method === "GET" ? Object.fromEntries(new URL(req.url).searchParams) : await req.json().catch(() => ({}));
        data = opts.schema.parse(json);
      }

      const result = await opts.handler({ data, req, userId });
      return ok(result);
    } catch (e) {
      if (e instanceof ZodError) return fail("Invalid input", 422, { issues: e.issues });
      logger.error({ err: e }, "API error");
      return fail("Internal server error", 500);
    }
  };
}
