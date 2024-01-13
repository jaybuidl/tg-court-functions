import axios from "axios";
import { Chain, PublicClient, createPublicClient, getAddress, getContract, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import {
    klerosCoreABI as klerosCoreABIDevnet,
    klerosCoreAddress as klerosCoreAddressDevnet,
} from "./klerosCore.devnet";
import {
    klerosCoreABI as klerosCoreABITestnet,
    klerosCoreAddress as klerosCoreAddressTestnet,
} from "./klerosCore.testnet";
import { notificationSystem, table } from "../../../config/supabase";
import PQueue from "p-queue";
import env from "../../../types/env";
import { humanizer } from "../../duration";

const queue = new PQueue({
    intervalCap: 20,
    interval: 1000,
    carryoverConcurrencyCount: true,
});

type Deployment = "devnet" | "testnet";

type Draw = {
    _address?: `0x${string}`;
    _disputeID?: bigint;
    _roundID?: bigint;
    _voteID?: bigint;
};

type CountedDraw = Draw & { count: number };

type DrawsByAddress = {
    [key: string]: CountedDraw[];
};

type RemainingTimes = {
    commitmentFromNow?: string;
    voteFromNow: string;
}

type StringByStringDictionary = { [key: string]: RemainingTimes };

const courtsByID: { [key: string]: readonly [bigint, boolean, bigint, bigint, bigint, bigint, boolean] } = {};
const courtPeriodsByID: { [key: string]: readonly [bigint, bigint, bigint, bigint] } = {};

export const draw = async (fromBlockNumber: bigint) => {
    const currentBlockNumber = await createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    }).getBlockNumber();
    const lastBlockNumber1 = await drawForDeployment(fromBlockNumber, "devnet");
    const lastBlockNumber2 = await drawForDeployment(fromBlockNumber, "testnet");
    const highestBlockNumber = [currentBlockNumber, lastBlockNumber1, lastBlockNumber2].reduce((a, b) => (a >= b ? a : b));
    return highestBlockNumber;
};

const drawForDeployment = async (fromBlockNumber: bigint, deployment: Deployment) => {
    const client = viemClientProvider();
    const { drawsByAddress, highestBlockNumber } = await getDrawsByAddress(client, fromBlockNumber, deployment);

    const subscriptions = await notificationSystem
        .from(table(`tg-juror-subscriptions`))
        .select("tg_user_id, juror_address")
        .then((response) => response.data ?? []);

    const subscribedJurors: string[] = subscriptions
        .map((user) => user.juror_address)
        .filter((address, index, array) => array.indexOf(address) === index)
        .filter((address): address is string => address !== undefined);

    // Remove non-subscribed jurors from drawsByAddress
    Object.keys(drawsByAddress).forEach((address) => {
        if (!subscribedJurors.includes(address)) {
            delete drawsByAddress[address];
        }
    });

    const uniqueDisputeIDs: bigint[] = Object.values(drawsByAddress)
        .flatMap((draws) => draws.filter((draw) => draw._disputeID))
        .map((draw) => draw._disputeID)
        .filter((disputeID, index, array) => array.indexOf(disputeID) === index)
        .filter((disputeID): disputeID is bigint => disputeID !== undefined);

    const remainingTimesByDisputeID: StringByStringDictionary = {};
    for (const disputeId of uniqueDisputeIDs) {
        remainingTimesByDisputeID[disputeId.toString()] = await getRemainingTime(client, deployment, disputeId);
    }

    console.log(drawsByAddress);

    for (const address of Object.keys(drawsByAddress)) {
        const users = subscriptions.filter((element) => element.juror_address === address);
        for (const user of users) {
            const tg_users_id: string = user.tg_user_id.toString();
            for (const draw of drawsByAddress[address]) {
                await queue.add(async () => {
                    try {
                        const text = formatMessage(draw, deployment, remainingTimesByDisputeID);
                        console.log(text);
                        await axios.post(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
                            chat_id: tg_users_id,
                            text: text,
                            parse_mode: "Markdown",
                            disable_web_page_preview: true,
                        });
                    } catch (e) {
                        console.error("Failed to send message to Telegram: ", e);
                    }
                });
            }
        }
    }

    await queue.onIdle();
    return highestBlockNumber;
};

const formatMessage = (draw: CountedDraw, deployment: Deployment, remainingTimesByDisputeID: StringByStringDictionary) => {
    if (!draw._address || !draw._disputeID) return undefined;
    const shortAddress = draw._address.slice(0, 6) + "..." + draw._address.slice(-4);
    const courtUrl = `${courtUrlProvider(deployment)}/#/cases/${draw._disputeID}`;
    const voteString = draw.count > 1 ? "votes" : "vote";
    const remainingTime = remainingTimesByDisputeID[draw._disputeID.toString()];
    const callToAction = remainingTime.commitmentFromNow
        ? `Vote committing ${remainingTime.commitmentFromNow}, Vote revealing ${remainingTime.voteFromNow}.`
        : `Voting ${remainingTime.voteFromNow}.`;
    return `
🏛️ *${deployment.toUpperCase()}*
🧑‍⚖️ Juror *${shortAddress}* has been drawn in [dispute ${draw._disputeID} round ${draw._roundID}](${courtUrl}) with ${
        draw.count
    } ${voteString}.
⏱️ ${callToAction}`;
};

const courtUrlProvider = (deployment: Deployment) => {
    switch (deployment) {
        case "devnet":
            return "https://dev--kleros-v2.netlify.app";
        case "testnet":
            return "https://v2.kleros.builders";
        default:
            throw new Error(`Unknown deployment: ${deployment}`);
    }
};

const klerosCoreProvider = (deployment: Deployment) => {
    switch (deployment) {
        case "devnet":
            return {
                abi: klerosCoreABIDevnet,
                address: klerosCoreAddressDevnet[arbitrumSepolia.id],
            };
        case "testnet":
            return {
                abi: klerosCoreABITestnet,
                address: klerosCoreAddressTestnet[arbitrumSepolia.id],
            };
        default:
            throw new Error(`Unknown deployment: ${deployment}`);
    }
};

const viemClientProvider = () => {
    const arbitrumSepoliaWithCustomRpc: Chain = env.PRIVATE_RPC_ENDPOINT_ARBITRUMSEPOLIA
        ? {
              ...arbitrumSepolia,
              rpcUrls: {
                  ...arbitrumSepolia.rpcUrls,
                  default: {
                      http: [env.PRIVATE_RPC_ENDPOINT_ARBITRUMSEPOLIA],
                  },
              },
          }
        : arbitrumSepolia;

    return createPublicClient({
        chain: arbitrumSepoliaWithCustomRpc,
        transport: http(),
    });
}

const getRemainingTime = async (client: PublicClient, deployment: Deployment, disputeId: bigint): Promise<RemainingTimes> => {
    const klerosCore = getContract({...klerosCoreProvider(deployment), publicClient: client});

    const dispute = await klerosCore.read.disputes([disputeId]);
    const courtId = dispute[0];
    const currentPeriod = dispute[2];
    const lastPeriodChange = dispute[4];
    // console.log("dispute id:", disputeId);
    // console.log("court id:", courtId);
    // console.log("current period:", currentPeriod);
    // console.log("last period change:", lastPeriodChange);

    if (currentPeriod == 2) {
        return { voteFromNow: humanizer(0n) };
    }
    if (currentPeriod >= 3) {
        return { voteFromNow: humanizer(-1n) };
    }

    if (!courtPeriodsByID[courtId.toString()]){
        courtPeriodsByID[courtId.toString()] = await klerosCore.read.getTimesPerPeriod([courtId]);
    }
    const periods = courtPeriodsByID[courtId.toString()];

    const currentPeriodDuration = periods[currentPeriod];
    const now = await client.getBlock().then((block) => block.timestamp);
    const currentPeriodRemaining = currentPeriodDuration - (now - lastPeriodChange);

    if (!courtsByID[courtId.toString()]){
        courtsByID[courtId.toString()] = await klerosCore.read.courts([courtId]);
    }
    const hiddenVotes = courtsByID[courtId.toString()][1];

    let evidencePeriodRemaining = 0n;
    let commitmentPeriodRemaining = 0n;
    let commitmentFromNow = 0n; 
    if (currentPeriod == 0) {
        evidencePeriodRemaining = currentPeriodRemaining;
        commitmentFromNow = evidencePeriodRemaining < 0n ? 0n : evidencePeriodRemaining; // Accounts for the bot possibly being late in passing the periods

        if (hiddenVotes) {
            // console.log("hidden votes enabled");
            commitmentPeriodRemaining = periods[1];
        }
    }

    if (currentPeriod == 1) {
        // console.log("hidden votes enabled");
        evidencePeriodRemaining = -1n;
        commitmentPeriodRemaining = currentPeriodRemaining;
        commitmentFromNow = evidencePeriodRemaining; // Accounts for the bot possibly being late in passing the periods
    }

    // Accounts for the bot possibly being late in passing the periods
    const voteStartFromNow = (evidencePeriodRemaining < 0n ? 0n : evidencePeriodRemaining) + commitmentPeriodRemaining;

    const remainingMessage: RemainingTimes = {
        commitmentFromNow: hiddenVotes ? humanizer(commitmentFromNow, commitmentFromNow + periods[1]) : undefined,
        voteFromNow: humanizer(voteStartFromNow, voteStartFromNow + periods[2]),
    };
    // console.log("remaining:", remainingMessage);
    return remainingMessage;
};

const getDrawsByAddress = async (client: PublicClient,fromBlockNumber: bigint, deployment: Deployment) => {
    // Many RPCs for Arbitrum Sepolia do not support eth_newFilter
    // In such case use getLogs() instead of createContractEventFilter()/getFilterLogs()
    // await client
    //   .getLogs({
    //     address: klerosCoreAddress[arbitrumSepolia.id],
    //     event: parseAbiItem(
    //       "event Draw(address indexed _address, uint256 indexed _disputeID, uint256 _roundID, uint256 _voteID)"
    //     ),
    //     fromBlock: 39051605n,
    //   })
    //   .then(console.log);

    const filter = await client.createContractEventFilter({
        ...klerosCoreProvider(deployment),
        eventName: "Draw",
        fromBlock: fromBlockNumber,
    });

    const logs = await client.getFilterLogs({ filter });

    const highestBlockNumber = logs.reduce((highest, log) => {
        if (log.blockNumber > highest) {
            return log.blockNumber;
        }
        return highest;
    }, 0n);

    const draws: Draw[] = logs.map((log) => log.args);

    const countedDraws = draws.reduce((acc: { [key: string]: CountedDraw }, draw) => {
        const key = `${draw._address}-${draw._disputeID}-${draw._roundID}`;
        if (!acc[key]) {
            acc[key] = {
                _address: draw._address,
                _disputeID: draw._disputeID,
                _roundID: draw._roundID,
                count: 0,
            };
        }
        acc[key].count++;
        return acc;
    }, {});

    const sortedDraws = Object.values(countedDraws).sort((a, b) => {
        if (a._disputeID !== undefined && b._disputeID !== undefined && a._disputeID !== b._disputeID) {
            return Number(a._disputeID - b._disputeID);
        }
        if (a._roundID !== undefined && b._roundID !== undefined && a._roundID !== b._roundID) {
            return Number(a._roundID - b._roundID);
        }
        if (a._address !== undefined && b._address !== undefined && a._address !== b._address) {
            return a._address < b._address ? -1 : 1;
        }
        return 0;
    });

    const drawsByAddress: DrawsByAddress = sortedDraws.reduce((acc: { [key: string]: CountedDraw[] }, draw) => {
        const key = draw._address ?? "";
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(draw);
        return acc;
    }, {});

    return { drawsByAddress, highestBlockNumber };
};

if (__filename === process.argv?.[1]) {
    // Does not run when imported
    if (!process.argv?.[2]) {
        console.error("Usage: draw.ts <fromBlockNumber>");
        process.exit(1);
    }
    const fromBlock = BigInt(process.argv?.[2]);
    drawForDeployment(fromBlock, "devnet")
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
