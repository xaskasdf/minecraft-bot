/**
 * /usr/bin/env node
 */

import debug from "debug";
import bot from "./bot.js";
import { program } from "commander";

const log = debug("minecraft-openai.cli:log");
const error = debug("minecraft-openai.cli:error");

program
  .name("minecraft-bot")
  .description("Playing Minecraft with GPT (proof of concept)")
  
program.command('start')
  .description('start the bot')
  .option("--host <host>", "hostname of the minecraft server", "localhost")
  .option("--port <port>", "port of the minecraft server", 25565)
  .option("--username <username>", "username of the bot", "OpenAI")
  .action(async(options) => {
    log("starting bot");
    await bot(options.host, options.port, "GPT").catch(error);
  });


program.parse();

