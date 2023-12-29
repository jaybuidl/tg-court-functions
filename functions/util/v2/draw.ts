import axios from "axios";
import { Chain, createPublicClient, getAddress, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import {
    klerosCoreABI as klerosCoreABIDevnet,
    klerosCoreAddress as klerosCoreAddressDevnet,
} from "./klerosCore.devnet";
import {
    klerosCoreABI as klerosCoreABITestnet,
    klerosCoreAddress as klerosCoreAddressTestnet,
} from "./klerosCore.testnet";
import { notificationSystem } from "../../../config/supabase";
import PQueue from "p-queue";

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

export const draw = async (fromBlockNumber: bigint) => {
    let highestBlockNumber = await drawForDeployment(fromBlockNumber, "devnet");
    highestBlockNumber = await drawForDeployment(fromBlockNumber, "testnet");
    return highestBlockNumber;
};

const drawForDeployment = async (
    fromBlockNumber: bigint,
    deployment: Deployment
) => {
    const { drawsByAddress, highestBlockNumber } = await getDrawsByAddress(
        fromBlockNumber,
        deployment
    );
    console.log(drawsByAddress);

    for (const address of Object.keys(drawsByAddress)) {
        const draws = drawsByAddress[address];
        const tg_users = await notificationSystem
            .from(`tg-juror-subscriptions`)
            .select("tg_user_id")
            .eq("juror_address", getAddress(address));

        if (!tg_users?.data || tg_users?.data?.length == 0) continue;

        for (const tg_user of tg_users?.data!) {
            const tg_users_id: string = tg_user.tg_user_id.toString();

            for (const draw of draws) {
                await queue.add(async () => {
                    console.log(formatMessage(draw, deployment));
                    await axios.post(
                        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
                        {
                            chat_id: tg_users_id,
                            text: formatMessage(draw, deployment),
                            parse_mode: "Markdown",
                            disable_web_page_preview: true,
                        }
                    );
                });
            }
        }
    }

    await queue.onIdle();
    return highestBlockNumber;
};

const formatMessage = (draw: CountedDraw, deployment: Deployment) => {
    if (!draw._address) return undefined;
    const shortAddress =
        draw._address.slice(0, 6) + "..." + draw._address.slice(-4);
    const courtUrl = `${courtUrlProvider(deployment)}/#/cases/${
        draw._disputeID
    }`;
    const voteString = draw.count > 1 ? "votes" : "vote";
    return `
🏛️ *${deployment.toUpperCase()}*
🧑‍⚖️ Juror *${shortAddress}* has been drawn in [dispute ${draw._disputeID} round ${draw._roundID}](${courtUrl}) with ${draw.count} ${voteString}.`;
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

const getDrawsByAddress = async (
    fromBlockNumber: bigint,
    deployment: Deployment
) => {
    const arbitrumSepoliaWithCustomRpc: Chain = process.env
        .PRIVATE_RPC_ENDPOINT_ARBITRUMSEPOLIA
        ? {
              ...arbitrumSepolia,
              rpcUrls: {
                  ...arbitrumSepolia.rpcUrls,
                  default: {
                      http: [process.env.PRIVATE_RPC_ENDPOINT_ARBITRUMSEPOLIA],
                  },
              },
          }
        : arbitrumSepolia;

    const client = createPublicClient({
        chain: arbitrumSepoliaWithCustomRpc,
        transport: http(),
    });
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

    const countedDraws = draws.reduce(
        (acc: { [key: string]: CountedDraw }, draw) => {
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
        },
        {}
    );

    const sortedDraws = Object.values(countedDraws).sort((a, b) => {
        if (
            a._disputeID !== undefined &&
            b._disputeID !== undefined &&
            a._disputeID !== b._disputeID
        ) {
            return Number(a._disputeID - b._disputeID);
        }
        if (
            a._roundID !== undefined &&
            b._roundID !== undefined &&
            a._roundID !== b._roundID
        ) {
            return Number(a._roundID - b._roundID);
        }
        if (
            a._address !== undefined &&
            b._address !== undefined &&
            a._address !== b._address
        ) {
            return a._address < b._address ? -1 : 1;
        }
        return 0;
    });

    const drawsByAddress: DrawsByAddress = sortedDraws.reduce(
        (acc: { [key: string]: CountedDraw[] }, draw) => {
            const key = draw._address ?? "";
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(draw);
            return acc;
        },
        {}
    );

    return { drawsByAddress, highestBlockNumber };
};

if (__filename === process.argv?.[1]) {
    // Does not run when imported
    if (!process.argv?.[2]) {
        console.error("Usage: draw.ts <fromBlockNumber>");
        process.exit(1);
    }
    const fromBlock = BigInt(process.argv?.[2]);
    draw(fromBlock)
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
