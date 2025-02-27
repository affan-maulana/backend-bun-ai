import { Context } from "hono";
import { LoginRequest, RegisterRequest } from "models/AuthModel";
import { AuthService } from "services/authService";
import { errorResponse, successResponse } from "@helpers/apiHelpers";

export const index = (ctx: Context) => {
  return ctx.json({
    success: true,
    message: "Hello",
  });
};

export const registerUser = async (ctx: Context) => {
  const request = (await ctx.req.json()) as RegisterRequest;
  try {
    const response = await AuthService.register(request);

    return successResponse(ctx, response, "Register Success !");
  } catch (e: any) {
    return errorResponse(ctx, e.status, e.message);
  }
};

export const loginUser = async (ctx: Context) => {
  const request = (await ctx.req.json()) as LoginRequest;
  try {
    const response = await AuthService.login(request);
    return successResponse(ctx, response, "Login Success !");
  } catch (e: any) {
    return errorResponse(ctx, e.status, e.message);
  }
};

// create function send email confirmation
export const sendEmailConfirmation = async (ctx: Context) => {
  const { email } = await ctx.req.json();
  try {
    const response = await AuthService.sendEmailConfirmation(email);
    return successResponse(ctx, response, "Email Confirmation Sent !");
  } catch (e: any) {
    return errorResponse(ctx, e.status, e.message);
  }
};

// create function verify email
export const verifyPinAndLogin = async (ctx: Context) => {
  const { email, tokenVerif } = await ctx.req.json();

  if (typeof tokenVerif !== "number") {
    return errorResponse(ctx, 400, "tokenVerif must be a number");
  }
  
  try {
    const response = await AuthService.verifyPinAndLogin(email, tokenVerif);
    return successResponse(ctx, response, "Verified !");
  } catch (e: any) {
    return errorResponse(ctx, e.status, e.message);
  }
}
