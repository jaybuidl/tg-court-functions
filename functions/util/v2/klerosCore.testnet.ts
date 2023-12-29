//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// KlerosCore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const klerosCoreABI = [
    { stateMutability: "payable", type: "fallback" },
    { stateMutability: "payable", type: "receive" },
    { type: "error", inputs: [], name: "AlreadyInitialized" },
    { type: "error", inputs: [], name: "AppealFeesNotEnough" },
    { type: "error", inputs: [], name: "AppealPeriodNotPassed" },
    { type: "error", inputs: [], name: "ArbitrationFeesNotEnough" },
    { type: "error", inputs: [], name: "ArraysLengthMismatch" },
    { type: "error", inputs: [], name: "CannotDisableClassicDK" },
    { type: "error", inputs: [], name: "CommitPeriodNotPassed" },
    { type: "error", inputs: [], name: "DepthLevelMax" },
    { type: "error", inputs: [], name: "DisputeKitNotSupportedByCourt" },
    { type: "error", inputs: [], name: "DisputeKitOnly" },
    { type: "error", inputs: [], name: "DisputeNotAppealable" },
    { type: "error", inputs: [], name: "DisputePeriodIsFinal" },
    { type: "error", inputs: [], name: "DisputeStillDrawing" },
    { type: "error", inputs: [], name: "EvidenceNotPassedAndNotAppeal" },
    { type: "error", inputs: [], name: "FailedDelegateCall" },
    { type: "error", inputs: [], name: "GovernorOnly" },
    { type: "error", inputs: [], name: "InvalidDisputKitParent" },
    { type: "error", inputs: [], name: "InvalidForkingCourtAsParent" },
    {
        type: "error",
        inputs: [
            {
                name: "implementation",
                internalType: "address",
                type: "address",
            },
        ],
        name: "InvalidImplementation",
    },
    { type: "error", inputs: [], name: "MinStakeLowerThanParentCourt" },
    { type: "error", inputs: [], name: "MustSupportDisputeKitClassic" },
    { type: "error", inputs: [], name: "NotEvidencePeriod" },
    { type: "error", inputs: [], name: "NotExecutionPeriod" },
    { type: "error", inputs: [], name: "NotInitializing" },
    { type: "error", inputs: [], name: "RulingAlreadyExecuted" },
    { type: "error", inputs: [], name: "SortitionModuleOnly" },
    { type: "error", inputs: [], name: "StakingFailed" },
    { type: "error", inputs: [], name: "TokenNotAccepted" },
    { type: "error", inputs: [], name: "TransferFailed" },
    { type: "error", inputs: [], name: "UUPSUnauthorizedCallContext" },
    {
        type: "error",
        inputs: [{ name: "slot", internalType: "bytes32", type: "bytes32" }],
        name: "UUPSUnsupportedProxiableUUID",
    },
    { type: "error", inputs: [], name: "UnsuccessfulCall" },
    { type: "error", inputs: [], name: "UnsupportedDisputeKit" },
    { type: "error", inputs: [], name: "VotePeriodNotPassed" },
    { type: "error", inputs: [], name: "WrongDisputeKitIndex" },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_token",
                internalType: "contract IERC20",
                type: "address",
                indexed: true,
            },
            {
                name: "_accepted",
                internalType: "bool",
                type: "bool",
                indexed: true,
            },
        ],
        name: "AcceptedFeeToken",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_arbitrable",
                internalType: "contract IArbitrableV2",
                type: "address",
                indexed: true,
            },
        ],
        name: "AppealDecision",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_arbitrable",
                internalType: "contract IArbitrableV2",
                type: "address",
                indexed: true,
            },
        ],
        name: "AppealPossible",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_courtID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_parent",
                internalType: "uint96",
                type: "uint96",
                indexed: true,
            },
            {
                name: "_hiddenVotes",
                internalType: "bool",
                type: "bool",
                indexed: false,
            },
            {
                name: "_minStake",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_alpha",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_feeForJuror",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_jurorsForCourtJump",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_timesPerPeriod",
                internalType: "uint256[4]",
                type: "uint256[4]",
                indexed: false,
            },
            {
                name: "_supportedDisputeKits",
                internalType: "uint256[]",
                type: "uint256[]",
                indexed: false,
            },
        ],
        name: "CourtCreated",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_roundID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_fromCourtID",
                internalType: "uint96",
                type: "uint96",
                indexed: true,
            },
            {
                name: "_toCourtID",
                internalType: "uint96",
                type: "uint96",
                indexed: false,
            },
        ],
        name: "CourtJump",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_courtID",
                internalType: "uint96",
                type: "uint96",
                indexed: true,
            },
            {
                name: "_hiddenVotes",
                internalType: "bool",
                type: "bool",
                indexed: false,
            },
            {
                name: "_minStake",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_alpha",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_feeForJuror",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_jurorsForCourtJump",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_timesPerPeriod",
                internalType: "uint256[4]",
                type: "uint256[4]",
                indexed: false,
            },
        ],
        name: "CourtModified",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_arbitrable",
                internalType: "contract IArbitrableV2",
                type: "address",
                indexed: true,
            },
        ],
        name: "DisputeCreation",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeKitID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_disputeKitAddress",
                internalType: "contract IDisputeKit",
                type: "address",
                indexed: true,
            },
        ],
        name: "DisputeKitCreated",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_courtID",
                internalType: "uint96",
                type: "uint96",
                indexed: true,
            },
            {
                name: "_disputeKitID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_enable",
                internalType: "bool",
                type: "bool",
                indexed: true,
            },
        ],
        name: "DisputeKitEnabled",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_roundID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_fromDisputeKitID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_toDisputeKitID",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
        ],
        name: "DisputeKitJump",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_address",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_roundID",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_voteID",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
        ],
        name: "Draw",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "version",
                internalType: "uint64",
                type: "uint64",
                indexed: false,
            },
        ],
        name: "Initialized",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_roundID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_pnkAmount",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_feeAmount",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_feeToken",
                internalType: "contract IERC20",
                type: "address",
                indexed: false,
            },
        ],
        name: "LeftoverRewardSent",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_feeToken",
                internalType: "contract IERC20",
                type: "address",
                indexed: true,
            },
            {
                name: "_rateInEth",
                internalType: "uint64",
                type: "uint64",
                indexed: false,
            },
            {
                name: "_rateDecimals",
                internalType: "uint8",
                type: "uint8",
                indexed: false,
            },
        ],
        name: "NewCurrencyRate",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_period",
                internalType: "enum KlerosCore.Period",
                type: "uint8",
                indexed: false,
            },
        ],
        name: "NewPeriod",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_arbitrable",
                internalType: "contract IArbitrableV2",
                type: "address",
                indexed: true,
            },
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_ruling",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
        ],
        name: "Ruling",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "_account",
                internalType: "address",
                type: "address",
                indexed: true,
            },
            {
                name: "_disputeID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_roundID",
                internalType: "uint256",
                type: "uint256",
                indexed: true,
            },
            {
                name: "_degreeOfCoherency",
                internalType: "uint256",
                type: "uint256",
                indexed: false,
            },
            {
                name: "_pnkAmount",
                internalType: "int256",
                type: "int256",
                indexed: false,
            },
            {
                name: "_feeAmount",
                internalType: "int256",
                type: "int256",
                indexed: false,
            },
            {
                name: "_feeToken",
                internalType: "contract IERC20",
                type: "address",
                indexed: false,
            },
        ],
        name: "TokenAndETHShift",
    },
    {
        type: "event",
        anonymous: false,
        inputs: [
            {
                name: "newImplementation",
                internalType: "address",
                type: "address",
                indexed: true,
            },
        ],
        name: "Upgraded",
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_disputeKitAddress",
                internalType: "contract IDisputeKit",
                type: "address",
            },
        ],
        name: "addNewDisputeKit",
        outputs: [],
    },
    {
        stateMutability: "payable",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
            {
                name: "_numberOfChoices",
                internalType: "uint256",
                type: "uint256",
            },
            { name: "_extraData", internalType: "bytes", type: "bytes" },
        ],
        name: "appeal",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "appealCost",
        outputs: [{ name: "cost", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "appealPeriod",
        outputs: [
            { name: "start", internalType: "uint256", type: "uint256" },
            { name: "end", internalType: "uint256", type: "uint256" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_extraData", internalType: "bytes", type: "bytes" },
            {
                name: "_feeToken",
                internalType: "contract IERC20",
                type: "address",
            },
        ],
        name: "arbitrationCost",
        outputs: [{ name: "cost", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "_extraData", internalType: "bytes", type: "bytes" }],
        name: "arbitrationCost",
        outputs: [{ name: "cost", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_feeToken",
                internalType: "contract IERC20",
                type: "address",
            },
            { name: "_accepted", internalType: "bool", type: "bool" },
        ],
        name: "changeAcceptedFeeTokens",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_courtID", internalType: "uint96", type: "uint96" },
            { name: "_hiddenVotes", internalType: "bool", type: "bool" },
            { name: "_minStake", internalType: "uint256", type: "uint256" },
            { name: "_alpha", internalType: "uint256", type: "uint256" },
            { name: "_feeForJuror", internalType: "uint256", type: "uint256" },
            {
                name: "_jurorsForCourtJump",
                internalType: "uint256",
                type: "uint256",
            },
            {
                name: "_timesPerPeriod",
                internalType: "uint256[4]",
                type: "uint256[4]",
            },
        ],
        name: "changeCourtParameters",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_feeToken",
                internalType: "contract IERC20",
                type: "address",
            },
            { name: "_rateInEth", internalType: "uint64", type: "uint64" },
            { name: "_rateDecimals", internalType: "uint8", type: "uint8" },
        ],
        name: "changeCurrencyRates",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_governor",
                internalType: "address payable",
                type: "address",
            },
        ],
        name: "changeGovernor",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_jurorProsecutionModule",
                internalType: "address",
                type: "address",
            },
        ],
        name: "changeJurorProsecutionModule",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_pinakion",
                internalType: "contract IERC20",
                type: "address",
            },
        ],
        name: "changePinakion",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_sortitionModule",
                internalType: "contract ISortitionModule",
                type: "address",
            },
        ],
        name: "changeSortitionModule",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            {
                name: "_toToken",
                internalType: "contract IERC20",
                type: "address",
            },
            { name: "_amountInEth", internalType: "uint256", type: "uint256" },
        ],
        name: "convertEthToTokenAmount",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        name: "courts",
        outputs: [
            { name: "parent", internalType: "uint96", type: "uint96" },
            { name: "hiddenVotes", internalType: "bool", type: "bool" },
            { name: "minStake", internalType: "uint256", type: "uint256" },
            { name: "alpha", internalType: "uint256", type: "uint256" },
            { name: "feeForJuror", internalType: "uint256", type: "uint256" },
            {
                name: "jurorsForCourtJump",
                internalType: "uint256",
                type: "uint256",
            },
            { name: "disabled", internalType: "bool", type: "bool" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_parent", internalType: "uint96", type: "uint96" },
            { name: "_hiddenVotes", internalType: "bool", type: "bool" },
            { name: "_minStake", internalType: "uint256", type: "uint256" },
            { name: "_alpha", internalType: "uint256", type: "uint256" },
            { name: "_feeForJuror", internalType: "uint256", type: "uint256" },
            {
                name: "_jurorsForCourtJump",
                internalType: "uint256",
                type: "uint256",
            },
            {
                name: "_timesPerPeriod",
                internalType: "uint256[4]",
                type: "uint256[4]",
            },
            {
                name: "_sortitionExtraData",
                internalType: "bytes",
                type: "bytes",
            },
            {
                name: "_supportedDisputeKits",
                internalType: "uint256[]",
                type: "uint256[]",
            },
        ],
        name: "createCourt",
        outputs: [],
    },
    {
        stateMutability: "payable",
        type: "function",
        inputs: [
            {
                name: "_numberOfChoices",
                internalType: "uint256",
                type: "uint256",
            },
            { name: "_extraData", internalType: "bytes", type: "bytes" },
        ],
        name: "createDispute",
        outputs: [
            { name: "disputeID", internalType: "uint256", type: "uint256" },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            {
                name: "_numberOfChoices",
                internalType: "uint256",
                type: "uint256",
            },
            { name: "_extraData", internalType: "bytes", type: "bytes" },
            {
                name: "_feeToken",
                internalType: "contract IERC20",
                type: "address",
            },
            { name: "_feeAmount", internalType: "uint256", type: "uint256" },
        ],
        name: "createDispute",
        outputs: [
            { name: "disputeID", internalType: "uint256", type: "uint256" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "", internalType: "contract IERC20", type: "address" },
        ],
        name: "currencyRates",
        outputs: [
            { name: "feePaymentAccepted", internalType: "bool", type: "bool" },
            { name: "rateInEth", internalType: "uint64", type: "uint64" },
            { name: "rateDecimals", internalType: "uint8", type: "uint8" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "currentRuling",
        outputs: [
            { name: "ruling", internalType: "uint256", type: "uint256" },
            { name: "tied", internalType: "bool", type: "bool" },
            { name: "overridden", internalType: "bool", type: "bool" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        name: "disputeKits",
        outputs: [
            { name: "", internalType: "contract IDisputeKit", type: "address" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
        name: "disputes",
        outputs: [
            { name: "courtID", internalType: "uint96", type: "uint96" },
            {
                name: "arbitrated",
                internalType: "contract IArbitrableV2",
                type: "address",
            },
            {
                name: "period",
                internalType: "enum KlerosCore.Period",
                type: "uint8",
            },
            { name: "ruled", internalType: "bool", type: "bool" },
            {
                name: "lastPeriodChange",
                internalType: "uint256",
                type: "uint256",
            },
        ],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
            { name: "_iterations", internalType: "uint256", type: "uint256" },
        ],
        name: "draw",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_courtID", internalType: "uint96", type: "uint96" },
            {
                name: "_disputeKitIDs",
                internalType: "uint256[]",
                type: "uint256[]",
            },
            { name: "_enable", internalType: "bool", type: "bool" },
        ],
        name: "enableDisputeKits",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
            { name: "_round", internalType: "uint256", type: "uint256" },
            { name: "_iterations", internalType: "uint256", type: "uint256" },
        ],
        name: "execute",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_destination", internalType: "address", type: "address" },
            { name: "_amount", internalType: "uint256", type: "uint256" },
            { name: "_data", internalType: "bytes", type: "bytes" },
        ],
        name: "executeGovernorProposal",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "executeRuling",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "getDisputeKitsLength",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "getNumberOfRounds",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "getNumberOfVotes",
        outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
            { name: "_round", internalType: "uint256", type: "uint256" },
        ],
        name: "getRoundInfo",
        outputs: [
            {
                name: "",
                internalType: "struct KlerosCore.Round",
                type: "tuple",
                components: [
                    {
                        name: "disputeKitID",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "pnkAtStakePerJuror",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "totalFeesForJurors",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "nbVotes",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "repartitions",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "pnkPenalties",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "drawnJurors",
                        internalType: "address[]",
                        type: "address[]",
                    },
                    {
                        name: "sumFeeRewardPaid",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "sumPnkRewardPaid",
                        internalType: "uint256",
                        type: "uint256",
                    },
                    {
                        name: "feeToken",
                        internalType: "contract IERC20",
                        type: "address",
                    },
                    {
                        name: "drawIterations",
                        internalType: "uint256",
                        type: "uint256",
                    },
                ],
            },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [{ name: "_courtID", internalType: "uint96", type: "uint96" }],
        name: "getTimesPerPeriod",
        outputs: [
            {
                name: "timesPerPeriod",
                internalType: "uint256[4]",
                type: "uint256[4]",
            },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "governor",
        outputs: [{ name: "", internalType: "address", type: "address" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_governor", internalType: "address", type: "address" },
            {
                name: "_pinakion",
                internalType: "contract IERC20",
                type: "address",
            },
            {
                name: "_jurorProsecutionModule",
                internalType: "address",
                type: "address",
            },
            {
                name: "_disputeKit",
                internalType: "contract IDisputeKit",
                type: "address",
            },
            { name: "_hiddenVotes", internalType: "bool", type: "bool" },
            {
                name: "_courtParameters",
                internalType: "uint256[4]",
                type: "uint256[4]",
            },
            {
                name: "_timesPerPeriod",
                internalType: "uint256[4]",
                type: "uint256[4]",
            },
            {
                name: "_sortitionExtraData",
                internalType: "bytes",
                type: "bytes",
            },
            {
                name: "_sortitionModuleAddress",
                internalType: "contract ISortitionModule",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "isDisputeKitJumping",
        outputs: [{ name: "", internalType: "bool", type: "bool" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [
            { name: "_courtID", internalType: "uint96", type: "uint96" },
            { name: "_disputeKitID", internalType: "uint256", type: "uint256" },
        ],
        name: "isSupported",
        outputs: [{ name: "", internalType: "bool", type: "bool" }],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "jurorProsecutionModule",
        outputs: [{ name: "", internalType: "address", type: "address" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_disputeID", internalType: "uint256", type: "uint256" },
        ],
        name: "passPeriod",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "pinakion",
        outputs: [
            { name: "", internalType: "contract IERC20", type: "address" },
        ],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "proxiableUUID",
        outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_courtID", internalType: "uint96", type: "uint96" },
            { name: "_newStake", internalType: "uint256", type: "uint256" },
        ],
        name: "setStake",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "function",
        inputs: [
            { name: "_account", internalType: "address", type: "address" },
            { name: "_courtID", internalType: "uint96", type: "uint96" },
            { name: "_newStake", internalType: "uint256", type: "uint256" },
            { name: "_alreadyTransferred", internalType: "bool", type: "bool" },
        ],
        name: "setStakeBySortitionModule",
        outputs: [],
    },
    {
        stateMutability: "view",
        type: "function",
        inputs: [],
        name: "sortitionModule",
        outputs: [
            {
                name: "",
                internalType: "contract ISortitionModule",
                type: "address",
            },
        ],
    },
    {
        stateMutability: "payable",
        type: "function",
        inputs: [
            {
                name: "newImplementation",
                internalType: "address",
                type: "address",
            },
            { name: "data", internalType: "bytes", type: "bytes" },
        ],
        name: "upgradeToAndCall",
        outputs: [],
    },
    {
        stateMutability: "nonpayable",
        type: "constructor",
        inputs: [
            {
                name: "_implementation",
                internalType: "address",
                type: "address",
            },
            { name: "_data", internalType: "bytes", type: "bytes" },
        ],
    },
] as const;

/**
 *
 */
export const klerosCoreAddress = {
    421614: "0x33d0b8879368acD8ca868e656Ade97bB97b90468",
} as const;

/**
 *
 */
export const klerosCoreConfig = {
    address: klerosCoreAddress,
    abi: klerosCoreABI,
} as const;
