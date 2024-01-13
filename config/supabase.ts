import env from "../types/env";
import { createClient } from "@supabase/supabase-js";
import { DatalakeDatabase, NotificationDatabase } from "../types";

export const datalake = createClient<DatalakeDatabase>(env.DATALAKE_URL, env.DATALAKE_KEY, {
    auth: { persistSession: false },
});

export const notificationSystem = createClient<NotificationDatabase>(env.NOTIFICATION_URL, env.NOTIFICATION_KEY, {
    auth: { persistSession: false },
});

export const table = (name: string) => (env.DEPLOYMENT === "staging" ? name + "-staging" : name);
