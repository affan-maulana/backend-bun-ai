import { Context } from "hono";
import { LoginRequest, RegisterRequest } from "models/AuthModel";
import { AuthService } from "services/authService";
import { errorResponse, successResponse } from "@helpers/apiHelpers";

export const index = (ctx: Context) => {
  return ctx.json({
    success: true,
    message: "Hello",
})
}

export const registerUser = async (ctx: Context) => {
  const request = await ctx.req.json() as RegisterRequest;
  try{
    const response = await AuthService.register(request)
    
    return successResponse(ctx, response, "Register Success !")
  }catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
};

export const loginUser = async (ctx: Context) => {
  const request = await ctx.req.json() as LoginRequest;
  try{
    const response = await AuthService.login(request)
    return successResponse(ctx, response, "Login Success !")
  }catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
};