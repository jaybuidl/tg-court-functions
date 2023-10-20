import { getAppealReminders, supportedChainIdsV1 } from "../../../config/subgraph";
import { getAddress } from "ethers";
import { JurorsAppealReminderQuery } from "../../../generated/kleros-v1-notifications";
import { notificationSystem } from "../../../config/supabase";
import { ArrayElement, BotData, Supported } from "../../../types";
import { Channel } from 'amqplib';
import { Logtail } from "@logtail/node";
import { sendToRabbitMQ } from "../rabbitMQ";
import { Wallet } from "ethers";

export const appealReminder = async (
    channel: Channel,
    logtail: Logtail,
    signer: Wallet,
    blockHeight: number,
    botData: BotData,
    testTgUserId?: number
): Promise<BotData> => {
    while (1){
        const timeNow = Math.floor(Date.now() / 1000);
        const reminderDeadline = timeNow + 86400; // 24 hours
        const jurorsAppeal = await getAppealReminders(
            botData.network as Supported<typeof supportedChainIdsV1>,
            {
                timeNow,
                reminderDeadline,
                blockHeight,
                idLast: botData.indexLast,
                blockLast: botData.blockHeight
            }
        )
        
        if (!jurorsAppeal || !jurorsAppeal.userDisputeInfos){
            logtail.error("invalid query or subgraph error. BotData: ", {botData});
            break;
        }

        if (jurorsAppeal.userDisputeInfos.length == 0) {
            botData.indexLast = "0";
            botData.blockHeight = blockHeight;
            break;
        }

        const jurors: string[] = jurorsAppeal.userDisputeInfos.map((juror) => getAddress(juror.juror));
        const jurorsMessages = jurorsAppeal.userDisputeInfos.map((juror) => {
            return { ...juror, message: formatMessage(juror, botData.network) };
          });
          
        const tg_users = await notificationSystem.rpc("get_subscribers", {vals: jurors})

        if (!tg_users || tg_users.error!= null){
            break;
        }

        let messages = [];
        for (const juror of jurorsMessages) {
            let tg_subcribers : number[] = [];
            if (testTgUserId != null){
                tg_subcribers.push(testTgUserId);
            } else {
                tg_users.data.find((tg_user) => tg_user.juror_address == getAddress(juror.juror));
                // get_subscribers returns sorted by juror_address
                let index = tg_users.data.findIndex((tg_user) => tg_user.juror_address == getAddress(juror.juror));
                if (index > -1){
                    while (tg_users.data[index]?.juror_address == getAddress(juror.juror)){
                        tg_subcribers.push(tg_users.data[index]?.tg_user_id);
                        index++;
                    }
                } 
                if (tg_subcribers.length == 0) continue;
            }
            // Telegram API malfunctioning, can't send caption with animation
            // sending two messages instead
            const payload = { 
                    tg_subcribers, 
                    messages: [
                        {
                        cmd: "sendAnimation",
                        file: "reminder",
                        },{
                        cmd: "sendMessage",
                        msg: juror.message,
                        options: 
                            {
                                parse_mode: "Markdown",
                            }
                        }
                    ]
                }
                messages.push({ payload, signedPayload: await signer.signMessage(JSON.stringify(payload))});
        }
        await sendToRabbitMQ(logtail, channel, messages);
        botData.indexLast = jurorsAppeal.userDisputeInfos[jurorsAppeal.userDisputeInfos.length - 1].id;
        if (jurorsAppeal.userDisputeInfos.length < 1000){
            botData.blockHeight = blockHeight;
            botData.indexLast = "0";
            break;
        };
    }
    return botData;
};

const formatMessage = (
    appeal: ArrayElement<JurorsAppealReminderQuery["userDisputeInfos"]>,
    network: number
) => {
    const secRemaining = Math.floor(Number(appeal.dispute.periodDeadline) - Date.now()/1000)
    const daysRemaining = Math.floor(secRemaining / 86400)
    const hoursRemaining = Math.floor((secRemaining % 86400) / 3600)
    const minRemaining = Math.floor((secRemaining % 3600) / 60)
    const timeRemaining = `${daysRemaining > 0 ? `${daysRemaining} day ` : ""}` +
                            `${hoursRemaining > 0 ? `${hoursRemaining} hour ` : ""}` +
                            `${minRemaining > 0 && daysRemaining == 0 ? `${minRemaining} min ` : ""}`
    const shortAddress = appeal.juror.slice(0, 5) + "..." + appeal.juror.slice(-3);

    return `[Dispute ${appeal?.dispute.id}](https://court.kleros.io/cases/${
        appeal?.dispute.id
    }) ${network == 1 ? "(*V1*)" : "(*V1 Gnosis*)"} concluded it's current round!
    
Juror *${shortAddress}* has voted in this disptue. If you think the current ruling is incorrect, you can request an [appeal](https://court.kleros.io/cases/${appeal.dispute.id}).

There is ${secRemaining > 60 ? `${timeRemaining}left to appeal.`: `less than a minute remains to appeal.`}`
};