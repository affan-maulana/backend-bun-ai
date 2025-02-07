import { Context } from "hono";
import { LoginRequest, RegisterRequest } from "models/AuthModel";
import { AuthService } from "services/authService";

export const index = (c: Context) => {
  return c.json({
    success: true,
    message: "Hello",
})
}

export const registerUser = async (c: Context) => {
  const request = await c.req.json() as RegisterRequest;
  const response = await AuthService.register(request)

  return c.json({
      success: true,
      message: "Register Success !",
      data: response
  })
};

export const loginUser = async (c: Context) => {
  const request = await c.req.json() as LoginRequest;
  const response = await AuthService.login(request)

  return c.json({
      success: true,
      message: "Login Success !",
      data: response
  })
};