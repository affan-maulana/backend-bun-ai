import {describe, expect, it} from "bun:test"
import app from "../src"

describe("Welcome", () => {
  it("Welcome", async() => {
    const response = await app.request("/api")
    expect(response.status).toBe(200)
  })
})