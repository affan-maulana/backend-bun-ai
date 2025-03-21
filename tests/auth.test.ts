import {describe, expect, it, afterEach, beforeEach} from "bun:test"
import {UserTest, ApiTest} from "./test-util"

describe("Authentication", () => {

  beforeEach(async () => {
    await UserTest.create()
  })

  it("Should be invalid register with null email", async() => {
    const body = {
      name: "",
      email: "",
      password: ""
    }
    const response = await ApiTest.apiHanlder("auth/register", "POST", body)
    expect(response.status).toBe(400)
  })

  it("Should reject register with existing email", async() => {
    const body = {
      name: "test",
      email: "test@test.com",
      password: "testLongPasswodd"
    }
    const response = await ApiTest.apiHanlder("auth/register", "POST", body)
    const bodyData = await response.json()
    
    expect(response.status).toBe(400)
    expect(bodyData.message).toBe("Email already exist")
  })

  it("Should success login user", async() => {
    const body = {
      email: "test@test.com",
      password: "testLongPasswodd"
    }
    const response = await ApiTest.apiHanlder("auth/login", "POST", body)
    const bodyData = await response.json()
    expect(response.status).toBe(200)
    expect(bodyData.data.email).toBe("test@test.com")
  })

  it("Should be Unauthorized Access Wrong Password", async() => {
    const body = {
      email: "test@test.com",
      password: "1231231231231"
    }
    const response = await ApiTest.apiHanlder("auth/login", "POST", body)
    expect(response.status).toBe(401)
  })

})