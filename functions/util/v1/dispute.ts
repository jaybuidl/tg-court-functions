import axios from "axios";
import { supportedChainIds, getKBSubgraphData } from "../../../config/subgraph";
import { NewDisputesQuery } from "../../../generated/kleros-board-graphql";
import { ArrayElement } from "../../../types";
import PQueue from "p-queue";
import env from "../../../types/env";
const queue = new PQueue({ intervalCap: 20, interval: 60000, carryoverConcurrencyCount: true });

export const dispute = async (disputeID: number, chainid: ArrayElement<typeof supportedChainIds>) => {
    const NewDisputeData = (await getKBSubgraphData(chainid, "NewDisputes", { disputeID })) as NewDisputesQuery;

    if (!NewDisputeData || !NewDisputeData.disputes) throw new Error("invalid timestamp or subgraph error");

    for (const dispute of NewDisputeData.disputes) {
        await queue.add(async () => {
            await formatMessage(dispute, chainid).then(
                async (msg) =>
                    await axios.post(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
                        chat_id: env.NOTIFICATION_CHANNEL,
                        text: msg,
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                    })
            );
        });
        if (dispute.disputeID > disputeID) {
            disputeID = dispute.disputeID;
        }
    }
    await queue.onIdle();
    return disputeID;
};

const formatMessage = async (dispute: ArrayElement<NewDisputesQuery["disputes"]>, chainid: number) => {
    let res;
    try {
        res = await axios.get(`https://cdn.kleros.link/${dispute.subcourtID.policy?.policy}`);
    } catch (e) {
        console.log(e);
    }

    return `[Dispute ${dispute.disputeID}](https://court.kleros.io/cases/${dispute.disputeID}) (*${
        chainid == 1 ? "mainnet" : "gnosis"
    }*)!
        
    Arbitrable: [${dispute.arbitrable.id}](https://${chainid == 1 ? "ether" : "gnosis"}scan.io/address/${
        dispute.arbitrable.id
    })
    Subcourt: ${res ? res.data.name : dispute.subcourtID}`;
};
