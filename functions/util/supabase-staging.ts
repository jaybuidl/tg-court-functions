import { notificationSystem } from "../../config/supabase";

export const main = async () => {
    // session is stored in memory
    const { data, error } = await notificationSystem.auth.signInWithPassword({
        email: process.env.NOTIFICATION_USER_EMAIL || "",
        password: process.env.NOTIFICATION_USER_PASSWORD || "",
    });
    // console.log("data", data);
    // console.log("error", error);

    console.log("selecting...");

    const res = await notificationSystem.from("tg-juror-subscriptions-staging").select();
    res.data?.forEach((row) => {
        console.log(row);
    });
};

if (__filename === process.argv?.[1]) {
    // Does not run when imported
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
