import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const processEnvSchema = z.object({
    BOT_TOKEN: z.string(),
    DATALAKE_URL: z.string(),
    DATALAKE_KEY: z.string(),
    DEPLOYMENT: z.enum(["production", "staging"]),
    FUNCTION_SECRET: z.string(),
    NOTIFICATION_CHANNEL: z.string(),
    NOTIFICATION_KEY: z.string(),
    NOTIFICATION_URL: z.string(),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
    PRIVATE_RPC_ENDPOINT_MAINNET: z.string(),
    PRIVATE_RPC_ENDPOINT_ARBITRUMSEPOLIA: z.string(),
    WEB_HOOK_URL: z.string(),
});

const env = processEnvSchema.parse(process.env);
export default env;
