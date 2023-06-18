// Import libraries and modules
import debug from "debug";
import minecraftData from "minecraft-data";
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import collectBlock from "mineflayer-collectblock";
import mineflayerPathfinder from "mineflayer-pathfinder";
import { callGPT } from "./api.js";
import { context, updateContext, loadContext, clearContext } from "./context/index.js";
import { watchPlayer, goToPlayer, mineBlock, giveToPlayer } from "./skills/sample.js";

// Define debug loggers
const log = debug("minecraft-bot.bot:log");
const error = debug("minecraft-bot.bot:error");

// Define global variables
let mcData;
let target;
let goToPlayerInterval;
let watchInterval;

// Export the bot function
export default async function bot(host, port, username) {
  // Create the bot
  const bot = mineflayer.createBot({
    username: username || "GPT",
    host: host || "localhost",
    port,
    verbose: true,
  });

  // Define event handlers
  bot.on("error", (err) => error(err));
  bot.on("login", () => log("bot joined the game"));
  bot.on("chat", handleChatEvent);
  bot.on("kicked", log);
  bot.on("error", log);
  bot.once("spawn", handleSpawnEvent);

  async function handleChatEvent(username, input) {
    // Ignore messages from the bot itself
    if (username === bot.username) return;

    // Handle "load context" and "reset context" commands
    if (input.startsWith("load context")) {
      const contextName = input.replace("load context", "").trim();
      if (contextName) {
        await loadContext(contextName);
        bot.chat(`Loaded context ${contextName}`);
        return;
      }
    } else if (input.startsWith("reset context")) {
      clearContext();
      bot.chat("Cleared context");
      return;
    }

    // Log the input and context
    const previousContext = context();
    log("input: %s", input);
    log("context: %s", previousContext);

    // Call the OpenAI API
    const response = await callGPT(input, previousContext);
    target = bot.players[username].entity;

    if (response) {
      // Log the OpenAI response
      log("request: %s", response.id);
      log("model: %s", response.model);
      log("choices: %o", response.choices);

      // Extract code instructions from response
      const code = response.choices.map((choice) => choice.text).join("\n");
      log("code: ", code);

      // If no code was received, inform the user
      if (code === "") {
        if (response.choices[0].message.content){
          bot.chat(response.choices[0].message.content);
        }
        else {
          // bot.chat(`I am sorry, I didn't understand.`);
          bot.chat(`SYSTEM: Lo siento, no entendí.`);
        }
        return;
      }

      try {
        // WARNING: this is a very dangerous way to execute code!
        // Do you trust AI?
        // Note: the code is executed in the context of the bot entity
        // Maybe we shouldn't be THAT worried about AI taking over a
        // Minecraft world...
        await eval(`(async function inject() {   
          try {  
            ${code}  
          } catch(err) {  
            error("error: %s", err.message);
            bot.chat(\`error: \${err.message}\`);
          }
        })()`);
        // Update the context for the next time
        // Note: we only update context if the code is valid
        updateContext(input, code);
      } catch (err) {
        error(`error: ${err.message}`);
        bot.chat(`error: ${err.message}`);
      }
    } else {
      log("OpenAI response was empty. Ignore.");
    }
  }

  function handleSpawnEvent() {
    mcData = minecraftData(bot.version);
    log("Minecraft version: %s", bot.version);
    log("Minecraft protocol version: %s", bot.protocolVersion);
  }
}