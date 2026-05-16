import { Log } from "./logger";

async function testLogger() {
  await Log(
    "backend",
    "info",
    "service",
    "Logger test successful"
  );
}

testLogger();