import { HTTPException } from 'hono/http-exception'
import { Hono } from 'hono'
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { ZodError } from "zod";
import { AuthRoutes } from "./routes/authRoutes";
import { ChatRoutes } from "./routes/chatRoutes";
var secret = process.env.JWT_SECRET || "secret";

const app = new Hono().basePath("/api");
app.use(cors());

// middleware
const authMiddleware = jwt({ secret });

// Routes
// app.use("/users", authMiddleware);
app.get("/", (c) => {
  return c.text("Welcome to Bun Chat API!");
});
app.route("/auth", AuthRoutes);
app.route("/chat", ChatRoutes);
app.notFound((c) => {
  return c.json(
    {
      errors: "Route not found",
    },
    404
  );
});

app.onError(async (err, c) => {
  if(err instanceof HTTPException) {
    c.status(err.status)
    return c.json({
      errors: err.message
    })
  } else if(err instanceof ZodError) {
    const messages = err.issues.map((issue) => issue.message); // Ambil hanya pesan error
    c.status(400);
    return c.json({
      errors: messages, // Kirim pesan-pesan error sebagai array
    });
  } else {
    c.status(400)
    return c.json({
      errors: err.message
    })
  }
})


export default app
