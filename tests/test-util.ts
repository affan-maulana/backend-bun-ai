import { prismaClient } from "application/database";
import app from "../src"

export class UserTest{
  static async create(){

    const password = await Bun.password.hash("testLongPasswodd", {
      algorithm: "bcrypt",
      cost: 10
    })

    await prismaClient.users.create({
      data: {
        name: "test",
        email: "test@test.com",
        password: password,
        description: "test",
      },
    });
  }

  static async delete(){
    await prismaClient.users.deleteMany({
      where: {
        email: "test@test.com"
      }
    })
  }
}

export class ApiTest {
  static async apiHanlder (url: string, method: string, body: object) {
    const response = await app.request('api/'+url,{
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    return response
  }
}