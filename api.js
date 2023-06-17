import dotenv from "dotenv";
import debug from "debug";
const { Configuration, OpenAIApi } = require("openai");

// Set up debug loggers
const log = debug("minecraft-openai.api:log");
const error = debug("minecraft-openai.api:error");

// Constants
const STOP_WORD = "//";
const EOL = "\n";

// Load .env configurations
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Check if OPENAI_API_KEY is present
if (!configuration) {
  error("ERROR: OPENAI_API_KEY is required.");
  throw (error, "ERROR: OPENAI_API_KEY is required.");
}

const openai = new OpenAIApi(configuration);

/**
 * Call the OpenAI API with the previous context and the new user input.
 * @param {string} input The user's input from the Minecraft chat.
 * @param {string} context The previous context to be sent to the OpenAI API
 * @returns {Promise<{ id: string, object: string, created: number, mode: string, choices: Array<{ text: string, index: number, logprobs: any, finish_reason: text }> }>}
 */
export async function callGPT(input, context) {
  const request = {
    model: "gpt-4",
    prompt: `${context}${EOL}${STOP_WORD} ${input}${EOL}`,
    temperature: 0,
    max_tokens: 150,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
    stop: [STOP_WORD],
  };

  log(`payload ${request}`);
  log("context:\n", request.prompt);

  const response = await openai.createCompletion({
    ...request
  });

  log(`response ${response}`);

  return await response.data;
}
