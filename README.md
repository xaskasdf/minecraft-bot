# Minecraft Bot

A proof of concept for making a Minecraft Non-Player Character using OpenAI's GPT-4.

## Requirements

- Clone this project on your local machine.
- [Minecraft](https://www.minecraft.net/en-us/get-minecraft) (Java Edition) version 1.19 (any above 1.14 really. Only tested on 19)
- Node.js version 18+
- An [OpenAI](https://openai.com) account 
- Create a `.env` file and copy your [OpenAI API key](https://platform.openai.com/account/api-keys) and save it

```
OPENAI_API_KEY=<your_api_key>
```

## How to use

### Start the Minecraft server

Here is how to start the Minecraft server:

1. Choose a host computer. This computer should be fast enough to play Minecraft, while running a server for other players as well.
2. Launch the game and click **Single Player**.
3. Create a new world or open an existing one. 
4. Inside that world, press the Esc key, and click **Open to LAN**. 
5. Choose a game mode to set for the other players.
6. Choose **Creative mode** that allows you to fly and place an infinite number of blocks.
7. Click **Start LAN World**, and you'll see a message that a local game has been hosted.
8. Take note of the port number.

### Launch the bot

From your terminal, run the following commands:

```
npm install
npm start -- --port [PORT]
```

In a few seconds, you should see a message that the bot is running, and you should see the NPC pop up in Minecraft.

### Sending commands

Inside the Minecraft client, press the `T` key to open the chat box.

### Loading context

There are multiple supported contexts:

1. `empty`: An empty context (default).
2. `simple`: A basic context.
3. `advanced`: A more complex context.

To load a context, type `load context [context_name]`.

You can also reset the current context by typing `reset context`.

## Disclaimer

This is a proof of concept. It is not intended to be used in production.

## Troubleshooting

### On WSL

If you are using WSL, you may need to provide the host computer's IP address to the bot.

```
npm start -- --port [PORT] --host [HOST]
```

To get the IP address of your host computer, run the following command:

```
wsl.exe hostname -I
