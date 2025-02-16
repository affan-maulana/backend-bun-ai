import { HTTPException } from 'hono/http-exception';
import { decode } from 'hono/jwt'

export function decodeToken (tokenHeader: string) : { payload: any, header: any }
{
  let decoded = { payload: null, header: null };
  const bearer = tokenHeader.split(' ');

  if (bearer.length > 1) {
    const token = bearer[1];
    return decode(token)
  }

  return decoded
}

export function getUserIdByToken(tokenHeader?: string) : string
{
  if (!tokenHeader) {
    throw new HTTPException(401, {
      message: "Token not provided"
    })
  }
  const { payload } = decodeToken(tokenHeader);
  if (!payload) {
    throw new HTTPException(401, {
        message: "Token not provided"
    })
  }
  if (payload?.sub?.id) {
    return payload?.sub?.id || "";
  }

  throw new HTTPException(401, {
    message: "Token not provided"
  })
}