import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { ZodError } from "zod";
import { AuthRoutes } from "./routes/authRoutes";
import { AiRoutes } from "./routes/aiRoutes";
import { SessionRoutes } from "./routes/sessionRoutes";

var secret = process.env.JWT_SECRET || "secret";

const app = new Hono().basePath("/api");
app.use(cors());

// middleware
const authMiddleware = jwt({ secret });

app.use("/session", authMiddleware);
app.use("/ai", authMiddleware);

// Routes
app.get("/", (c) => {
  return c.text("Welcome to Bun Chat API!");
});

app.route("/auth", AuthRoutes);
app.route("/ai", AiRoutes);
app.route("/session", SessionRoutes);

app.notFound((c) => {
  return c.json({ errors: "Route not found" }, 404);
});

app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({ errors: err.message });
  } else if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => issue.message);
    c.status(400);
    return c.json({ errors: messages });
  } else {
    c.status(400);
    return c.json({ errors: err.message });
  }
});

export default app;
