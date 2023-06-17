import fetch from "isomorphic-fetch";
import dotenv from "dotenv";
import debug from "debug";
const { Configuration, OpenAIApi } = require("openai");

const log = debug("minecraft-openai.api:log");
const error = debug("minecraft-openai.api:error");
const STOP_WORD = "//";
const EOL = "\n";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Call the OpenAI API with the previous context and the new user input.
 *
 * @param {string} input The user's input from the Minecraft chat.
 * @param {string} context The previous context to be sent to the OpenAI API
 * @returns {Promise<{ id: string, object: string, created: number, mode: string, choices: Array<{ text: string, index: number, logprobs: any, finish_reason: text }> }>}
 */
export async function callGPT(input, context) {
  if (!configuration) {
    error("ERROR: OPENAI_API_KEY is required.");
    throw (error, "ERROR: OPENAI_API_KEY is required.");
  }
  const openai = new OpenAIApi(configuration);

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

  // const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${openAIkey}`,
  //   },
  //   body: JSON.stringify(body),
  // });

  // if (!response.ok) {
  //   error("api response failed with statis %s", response.statusText);
  //   return;
  // }

  return await response.data;
}
