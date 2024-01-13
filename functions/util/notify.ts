import { appeal } from "./v1/appeal";
import { dispute } from "./v1/dispute";
import { draw } from "./v1/draw";
import { draw as drawV2 } from "./v2/draw";
import { notificationSystem, table } from "../../config/supabase";
import { StatusCodes } from "http-status-codes";
import { supportedChainIds } from "../../config/subgraph";
import { ArrayElement } from "../../types";

const bots = {
    V1_COURT_DRAW: "court-draw",
    V2_COURT_DRAW: "court-draw-v2",
    V1_COURT_DISPUTE: "court-dispute",
    V1_COURT_APPEAL: "court-appeal",
};

export const notify = async () => {
    try {
        const { data, error } = await notificationSystem
            .from(table("hermes-counters"))
            .select("*")
            .like("bot_name", "%-v2") // WARNING: v2 only
            .order("bot_name", { ascending: true });

        if (error || !data || data.length == 0) {
            console.error(error);
            return {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }

        for (const row of data) {
            console.log(row);
            if (row.blockHeight === null) {
                console.warn(`Missing blockHeight for bot '${row.bot_name}', skipping`);
                continue;
            }
            const chainId = row.network as ArrayElement<typeof supportedChainIds>;
            if (!supportedChainIds.includes(chainId)) {
                console.warn(`Unknown network '${row.network}' for bot '${row.bot_name}', skipping`);
                continue;
            }
            switch (row.bot_name) {
                case bots.V1_COURT_APPEAL: {
                    console.log(bots.V1_COURT_APPEAL);
                    const timestampUpdate = await appeal(row.blockHeight, chainId);
                    await notificationSystem
                        .from(table(`hermes-counters`))
                        .update({ blockHeight: timestampUpdate })
                        .eq("bot_name", bots.V1_COURT_APPEAL)
                        .eq("network", chainId);
                    break;
                }
                case bots.V1_COURT_DISPUTE: {
                    console.log(bots.V1_COURT_DISPUTE);
                    const disputeIDUpdate = await dispute(row.blockHeight, chainId);
                    await notificationSystem
                        .from(table(`hermes-counters`))
                        .update({ blockHeight: disputeIDUpdate })
                        .eq("bot_name", bots.V1_COURT_DISPUTE)
                        .eq("network", chainId);
                    break;
                }
                case bots.V2_COURT_DRAW: {
                    console.log(bots.V2_COURT_DRAW);
                    const blockNumberUpdate = await drawV2(BigInt(row.blockHeight + 1));
                    await notificationSystem
                        .from(table(`hermes-counters`))
                        .update({ blockHeight: Number(blockNumberUpdate) }) // Dangerous if higher than Number.MAX_SAFE_INTEGER
                        .eq("bot_name", bots.V2_COURT_DRAW)
                        .eq("network", chainId);
                    break;
                }
                case bots.V1_COURT_DRAW: {
                    console.log(bots.V1_COURT_DRAW);
                    const timestampUpdate = await draw(row.blockHeight, chainId);
                    await notificationSystem
                        .from(table(`hermes-counters`))
                        .update({ blockHeight: timestampUpdate })
                        .eq("bot_name", bots.V1_COURT_DRAW)
                        .eq("network", chainId);
                    break;
                }
                default: {
                    console.warn(`Unknown bot '${row.bot_name}', skipping`);
                    continue;
                }
            }
        }
        return {
            statusCode: StatusCodes.OK,
        };
    } catch (err: any) {
        console.log(err);
        return {
            statusCode: StatusCodes.BAD_REQUEST,
        };
    }
};

if (__filename === process.argv?.[1]) {
    // Does not run when imported
    notify()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
