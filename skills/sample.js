// import { Player } from "minecraft-player";
// import { Item } from "prismarine-item";
// import mineflayer from "mineflayer";
// import { pathfinder, Movements } from "mineflayer-pathfinder";
import { pathfinder } from "mineflayer-pathfinder";

import bot from "../bot";

const mcData = require('minecraft-data')(bot.version);

// Watch a player
export async function watchPlayer(bot, playerName) {
  const target = bot.players[playerName];
  if (target && target.entity) {
    bot.chat(`I am watching ${target.displayName}`);
    bot.lookAt(target.entity.position.offset(0, target.entity.height, 0));
  } else {
    bot.chat(`Cannot find ${playerName}`);
  }
}

// Go to a player
export async function goToPlayer(bot, playerName) {
  const target = bot.players[playerName];
  if (target && target.entity) {
    bot.chat(`Going to ${target.displayName}`);
    bot.pathfinder.setGoal(new pathfinder.goals.GoalFollow(target.entity, 1));
  } else {
    bot.chat(`Cannot find ${playerName}`);
  }
}

// Mine a block
export async function mineBlock(bot, blockType) {
  const block = bot.findBlock({
    matching: mcData.blocksByName[blockType].id,
    maxDistance: 64,
  });
  if (block) {
    bot.chat("I am mining a block");
    await bot.dig(block);
    bot.chat(`Block ${block.toString()} collected`);
  } else {
    bot.chat("I can't find that block nearby");
  }
}

// Give an item to a player
export async function giveToPlayer(bot, playerName, item, amount = 1) {
  const target = bot.players[playerName];
  if (target && target.entity) {
    bot.chat(`Giving ${item} to ${target.displayName}`);
    // You'll need to implement this function to actually give the item.
    await goToPlayer(bot, 2, target);
    bot.once('goal_reached', () => {
      const items = bot.inventory.items();
      const item = items.filter(item => item.name === name)[0];
      if (!item) {
        bot.chat(`I have no ${ name }`);
        return false;
      } else if (amount) {
        bot.toss(item.type, null, amount);
        bot.chat("Here you go!");
      }
    });
  } else {
    bot.chat(`Cannot find ${playerName}`);
  }
}
