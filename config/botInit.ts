import TelegramBot = require("node-telegram-bot-api");
import axios from "axios";
import { bot } from "../assets/multilang.json";
import env from "../types/env";

require("dotenv").config();
const { BOT_TOKEN, WEB_HOOK_URL, FUNCTION_SECRET } = env;
const tgBot = new TelegramBot(BOT_TOKEN, { polling: false });
const client = axios.create({
    baseURL: `https://api.telegram.org/bot${BOT_TOKEN}`,
    headers: {
        common: {
            "User-Agent": "",
        },
        post: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    },
});

const initialize = async () => {
    console.log("Setting multilang bot info . . .");
    for (const lang in bot.names) {
        const name = bot.names[lang as keyof typeof bot.names] + " (v2)"; // TODO: make the suffix a config variable?
        console.log("setting bot name ", lang, name);
        try {
            const result = await client.post(`/setMyName`, {
                name: name,
                language_code: lang,
            });
            // console.log(result.request);
        } catch (e) {
            console.error("failed setting name ", lang, name);
            console.error(e);
        }
    }

    for (const lang in bot.short_descriptions) {
        const short_description = bot.short_descriptions[lang as keyof typeof bot.names];
        console.log("setting bot short description ", lang);
        try {
            await client.post(`/setMyShortDescription`, {
                short_description: short_description,
                language_code: lang,
            });
        } catch (e) {
            console.error("failed setting short description ", lang, short_description);
            console.error(e);
        }
    }

    for (const lang in bot.descriptions) {
        const description = bot.descriptions[lang as keyof typeof bot.names];
        console.log("setting bot description ", lang);
        try {
            await client.post(`/setMyDescription`, {
                description: description,
                language_code: lang,
            });
        } catch (e) {
            console.error("failed setting description ", lang, description);
            console.error(e);
        }
    }

    for (const lang in bot.commands) {
        const commands = bot.commands[lang as keyof typeof bot.commands];
        console.log("setting commands", lang);
        try {
            await tgBot.setMyCommands(commands, { language_code: lang }); //, scope: 'all_private_chats' as unknown as TelegramBot.BotCommandScopeAllPrivateChats})
        } catch (e) {
            console.error("failed setting commands ", lang, commands);
            console.error(e);
        }
    }

    console.log("setting webhook");
    try {
        await client.post(`/setWebhook`, {
            url: WEB_HOOK_URL,
            allowed_updates: ["message", "callback_query"],
            drop_pending_updates: true,
            secret_token: FUNCTION_SECRET,
        });
    } catch (e) {
        console.error("failed setting webhook");
        console.error(e);
    }
};

if (__filename === process.argv?.[1]) {
    // Does not run when imported
    initialize()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
