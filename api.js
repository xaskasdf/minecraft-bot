import dotenv from "dotenv";
import debug from "debug";
// const { Configuration, OpenAIApi } = require("openai");
import * as openai from "openai";

// { Configuration, OpenAIApi }

// Set up debug loggers
const log = debug("minecraft-bot.api:log");
const error = debug("minecraft-bot.api:error");

// Constants
const STOP_WORD = "//";
const EOL = "\n";

// Load .env configurations
dotenv.config();

const configuration = new openai.Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Check if OPENAI_API_KEY is present
if (!configuration) {
  error("ERROR: OPENAI_API_KEY is required.");
  throw (error, "ERROR: OPENAI_API_KEY is required.");
}

const openAiApi = new openai.OpenAIApi(configuration);

/**
 * Call the OpenAI API with the previous context and the new user input.
 * @param {string} input The user's input from the Minecraft chat.
 * @param {string} context The previous context to be sent to the OpenAI API
 * @returns {Promise<{ id: string, object: string, created: number, mode: string, choices: Array<{ text: string, index: number, logprobs: any, finish_reason: text }> }>}
 */
export async function callGPT(input, context) {
  // const request = {
  //   model: process.env.MODEL,
  //   prompt: `${context}${EOL}${STOP_WORD} ${input}${EOL}`,
  //   temperature: 0,
  //   max_tokens: 150,
  //   top_p: 1.0,
  //   frequency_penalty: 0.5,
  //   presence_penalty: 0.0,
  //   stop: [STOP_WORD],
  // };
  const messages = [
    {"role": "system", "content": "Eres un bot de minecraft, puedes ejecutar algunas acciones utilizando eval " +
          `respondiendo adecuadamente. El contexto es el siguiente: ${context}${EOL}${STOP_WORD}`},
    {"role": "user", "content": `${input}${EOL}`}
  ];

  const request = {
    model: process.env.MODEL,
    messages,
  };

  log(`payload ${request}`);
  log("context:\n", request.prompt);

  // const response = await openAiApi.createCompletion({
  // ...request
  //   });
  const response = await openAiApi.createChatCompletion({
    ...request
  });

  log(`response ${response.data.choices[0].message.content}`);

  return await response.data;
}
