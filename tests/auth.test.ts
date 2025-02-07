import {describe, expect, it, afterEach} from "bun:test"
import app from "../src"
import {UserTest, ApiTest} from "./test-util"

describe("Authentication", () => {

  afterEach(() => {
    UserTest.delete()
  })

  it("Should be Unauthorized Access", async() => {
    const body = {
      email: "test@test.com",
      password: "test"
    }
    const response = await ApiTest.apiHanlder("api/auth/login", "POST", body)
    expect(response.status).toBe(404)
  })

  it("Should be invalid register with null email", async() => {
    const body = {
      name: "",
      email: "",
      password: ""
    }
    const response = await ApiTest.apiHanlder("api/auth/register", "POST", body)
    expect(response.status).toBe(400)
  })

  it("Should reject register with existing email", async() => {
    // Create User
    await UserTest.create()

    const body = {
      name: "test",
      email: "test@test.com",
      password: "test"
    }
    const response = await ApiTest.apiHanlder("api/auth/register", "POST", body)
    expect(response.status).toBe(400)
  })

  it("Should success login user", async() => {
    const body = {
      email: "test@test.com",
      password: "test"
    }
    const response = await ApiTest.apiHanlder("api/auth/login", "POST", body)
    const bodyData = await response.json()
    expect(response.status).toBe(200)
    expect(bodyData.data.email).toBe("test@test.com")
  })

})