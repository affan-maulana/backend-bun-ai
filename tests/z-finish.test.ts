import {describe, beforeEach, it, expect} from "bun:test"
import {ApiTest, UserTest} from "./test-util"
import 'dotenv/config';

describe("Finish Test", () => {
    
  beforeEach(async () => {
    await UserTest.delete()
  })

  it("should failed login", async() => {
    const body = {
      email: "test@test.com",
      password: "testLongPasswodd"
    }
    const response = await ApiTest.apiHanlder("auth/login", "POST", body)
    expect(response.status).toBe(404)
  })

})
