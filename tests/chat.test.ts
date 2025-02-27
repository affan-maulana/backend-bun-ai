import {describe, expect, it, afterEach, beforeEach} from "bun:test"
import {ApiTest, UserTest} from "./test-util"
import 'dotenv/config';

describe("Session", () => {

  beforeEach(async () => {
    await ApiTest.login()
  })

  it("should create new session", async() => {
    const response = await ApiTest.apiHanlder("session", "POST")
    const bodyData = await response.json()
    expect(response.status).toBe(201)
    process.env.TESTING_SESSION = bodyData?.data?.id
  })

  it("should get all session", async() => {
    const response = await ApiTest.apiHanlder("session", "GET")
    expect(response.status).toBe(200)
  })

  it("should rename session", async() => { 
    const body = {
      newName: "Nama Baru"
    }
    const sessionId = process.env.TESTING_SESSION
    const response = await ApiTest.apiHanlder(`session/${sessionId}`, "PUT", body)
    expect(response.status).toBe(200)
  })
  
  // it("should delete session", async() => {
  //   const response = await ApiTest.apiHanlder(`session/${sessionId}`, "DELETE")
  //   expect(response.status).toBe(200)
  // })

})

describe("Chat", () => {
  it("should create new chat", async() => {
    const body = {
      message: "Ping"
    }
    const sessionId = process.env.TESTING_SESSION
    
    const response = await ApiTest.apiHanlder(`ai/chat/${sessionId}`, "POST", body)
    const bodyData = await response.json()
    console.log("=== New Message ===\n", bodyData);
    expect(response.status).toBe(201)
  })

  it("should get all chat", async() => {
    const sessionId = process.env.TESTING_SESSION
    const response = await ApiTest.apiHanlder(`ai/chat/${sessionId}`, "GET")
    const bodyData = await response.json()
    console.log("=== Messages ===\n", bodyData);
    
    expect(response.status).toBe(200)
  })
})
