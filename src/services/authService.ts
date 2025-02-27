import { prismaClient } from "application/database";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { Users } from ".prisma/client";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  toLoginResponse,
  toRegisterResponse,
} from "models/AuthModel";
import { AuthValidation } from "validation/AuthValidation";
import { sendEmail } from "@helpers/mailerHelper";
var secret = process.env.JWT_SECRET || "secret";

export class AuthService {

  static async register(request: RegisterRequest): Promise<RegisterResponse> {
    request = AuthValidation.CREATE.parse(request);
    const check = await prismaClient.users.findFirst({
      where: {
        OR: [{ email: request.email }],
      },
    });

    if (check) {
      throw new HTTPException(400, {
        message: "Email already exist",
      });
    }

    // create hash string for password
    request.password = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const user = await prismaClient.users.create({
      data: {
        name: request.name,
        email: request.email,
        phone: request.phone,
        password: request.password,
        description: request.description,
      },
    });

    return toRegisterResponse(user);
  }

  static async login(request: LoginRequest): Promise<LoginResponse> {
    request = AuthValidation.LOGIN.parse(request);
    const user = await prismaClient.users.findFirst({
      where: {
        email: request.email,
      }
    });

    if (!user) {
      throw new HTTPException(404, {
        message: "User not found !",
      });
    }

    if (!user.emailVerified) {
      throw new HTTPException(401, {
        message: "Email not verified",
      });
    }

    const isPasswordValid = await Bun.password.verify(
      request.password,
      user.password,
      "bcrypt"
    );
    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: "Username or password is wrong",
      });
    }

		const dataReturn = await jwtLogin(user);

    return toLoginResponse(dataReturn);
  }

  static async sendEmailConfirmation(email: string) {
    const user = await prismaClient.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HTTPException(404, {
        message: "User not found !",
      });
    }

    if (user.emailVerified) {
      throw new HTTPException(400, {
        message: "Email already verified",
      });
    }

    const tokenVerif = Math.floor(100000 + Math.random() * 900000);
		// const tokenVerif = 999999;
    const tokenVerifExp = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes

    //update tokenVerif in user
    await prismaClient.users.update({
      where: {
        email: email,
      },
      data: {
        tokenVerif: tokenVerif,
        tokenVerifExpiredAt: tokenVerifExp,
      },
    });

		// Send email confirmation
    const subject = "Affan BUN CHAT - Email Confirmation";
    const text = `Thank you for registering to my platform. Your tokenVerif is ${tokenVerif}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Thank you for registering to my platform</h2>
        <p>Your token is:</p>
        <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">
          <h2 style="color: #000; font-weight: bold; margin: 0;">${tokenVerif}</h2>
        </div>
        <p>Please use this token to verify your email. Valid for 5 minutes</p>
      </div>
    `;
		
    sendEmail(email, subject, text, html);

    // send email confirmation
    return {
      message: "Email Confirmation Sent",
      tokenVerif,
    };
  }

	static async verifyPinAndLogin(email: string, tokenVerif: number) {
    const user = await prismaClient.users.findFirst({
      where: {
        email: email,
        tokenVerif: tokenVerif,
      }
    })

    if (!user) {
      throw new HTTPException(404, {
        message: "User not found !",
      });
    }

    if (user.emailVerified) {
      throw new HTTPException(400, {
        message: "Email already verified",
      });
    }

    if (user?.tokenVerifExpiredAt) {
      if(user.tokenVerifExpiredAt < new Date()) {
        throw new HTTPException(400, {
          message: "Token expired",
        });
      }
    }

    // update emailVerified in user
    await prismaClient.users.update({
      where: {
        email: email,
      },
      data: {
        emailVerified: true,
        tokenVerif: null,
        tokenVerifExpiredAt: null,
      },
    });

		const dataReturn = await jwtLogin(user);
		return dataReturn
	}
}

async function jwtLogin (user: Users) {
	const userPayload = {
		id: user.id,
		email: user.email,
	};

	const payload = {
		sub: userPayload,
		role: "client",
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5, // Token expires in 5 hours
	};
	const token = await sign(payload, secret);

	const tokenUser = {
		id: user.id,
		email: user.email,
		phone: user.phone,
		description: user.description,
		token: token
	}
	return tokenUser;
}
