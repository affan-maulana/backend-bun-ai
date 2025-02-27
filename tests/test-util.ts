import { prismaClient } from "application/database";
import app from "../src";
import "dotenv/config";

const testingPassword = "testLongPasswodd";
export class UserTest {
  static async create() {
    const password = await Bun.password.hash(testingPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const userId = await prismaClient.users.findFirst({
      where: {
        email: "test@test.com",
      },
      select: {
        id: true,
      },
    });

    if (!userId) {
      await prismaClient.users.create({
        data: {
          name: "test",
          email: "test@test.com",
          password: password,
          description: "test",
        },
      });
    }
  }

  static async delete() {
    const userId = await prismaClient.users.findFirst({
      where: {
        email: "test@test.com",
      },
      select: {
        id: true,
      },
    });

    if (userId) {
      const getSessionByUser = await prismaClient.sessions.findMany({
        where: {
          userId: userId.id,
        },
      });

      if (getSessionByUser.length > 0) {
        // delete chat by sessionId
        await prismaClient.messages.deleteMany({
          where: {
            session: {
              userId: userId.id,
            },
          },
        })

        // delete session by userId
        await prismaClient.sessions.deleteMany({
          where: {
            userId: userId.id
          },
        });
      }

      // delete user
      await prismaClient.users.deleteMany({
        where: {
          id: userId.id
        },
      });
      
    }
  }
}

export class ApiTest {
  static async apiHanlder(url: string, method: string, body?: object) {
    const token = process.env.TESTING_TOKEN;
    // console.log("===Token From API Handler===\n", token);

    const response = await app.request("api/" + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    return response;
  }

  static async login() {
    const body = {
      email: "test@test.com",
      password: "testLongPasswodd",

      // email: "affan.m1993@gmail.com",
      // password: "12qwaszx"
    };
    const response = await ApiTest.apiHanlder("auth/login", "POST", body);
    const bodyData = await response.json();

    // save token
    process.env.TESTING_TOKEN = bodyData.data.token;
  }
}
