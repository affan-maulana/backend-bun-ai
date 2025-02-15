import { Context } from "hono"
import { StatusCode } from "hono/utils/http-status"

export const successResponse = (c: Context, data: any, message?: string, status: StatusCode = 200) => {
  c.status(status)
  return c.json({
    success: true,
    message: message,
    data: data,
  })
}

export const errorResponse = (c: Context, status: StatusCode = 400, message?: string) => {
  c.status(status)
  return c.json({
    success: false,
    message: message,
  })
}