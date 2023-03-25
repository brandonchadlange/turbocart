import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import HttpException from "./http-exception";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type HttpHandler = (request: NextApiRequest, response: NextApiResponse) => void;

interface RouteHandlerParams {
  GET?: HttpHandler;
  POST?: HttpHandler;
  PUT?: HttpHandler;
  DELETE?: HttpHandler;
}

export function RouteHandler(handlers: RouteHandlerParams) {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    await NextCors(request, response, {
      methods: ["*"],
      origin: request.headers.origin,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    const method = request.method as HttpMethod;
    const handler = handlers[method];

    if (!handler) {
      return response.status(405).send("Method not allowed");
    }

    try {
      return await handler!(request, response);
    } catch (err) {
      const error = err as HttpException;
      response.status(error.status).send(error.response);
    }
  };
}
