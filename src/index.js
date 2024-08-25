import { handleRequest } from "./handlerEntry.js";
import { serializeError } from "serialize-error";
import { default as LogUtility } from "./utils/LoggingUtility.js";

export default {
  async queue(batch, env) {
    self.location = new URL("https://www.google.com");
    const loggingContext = await LogUtility.buildLogContext(env);
    for (let msg of batch) {
      try {
        console.log("Queue message received", msg);
        // await handleRequest(msg, env, {
        //   isQueue: true,
        // });
      } catch (e) {
        const responseError = serializeError(e);
        await LogUtility.logEntry(loggingContext, [
          {
            severity: "ERROR",
            jsonPayload: {
              message: "Exception occurred in queue",
              error: responseError,
            },
          },
        ]);
      }
    }
  },
};
