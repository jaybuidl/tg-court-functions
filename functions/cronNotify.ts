import { schedule } from "@netlify/functions";
import { notify } from "./util/notify";

// https://docs.netlify.com/functions/scheduled-functions/#supported-cron-extensions
export const handler = schedule("@hourly", notify)