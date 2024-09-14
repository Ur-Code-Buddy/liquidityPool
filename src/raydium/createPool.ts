import {
    MARKET_STATE_LAYOUT_V3,
    AMM_V4,
    OPEN_BOOK_PROGRAM,
    FEE_DESTINATION_ID,
    DEVNET_PROGRAM_ID,
} from '@raydium-io/raydium-sdk-v2';
import { initSdk, txVersion } from './config';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';

interface CreateAmmPoolParams {
    marketId: PublicKey;
    baseMintInfo: {
        mint: PublicKey;
        decimals: number;
    };
    quoteMintInfo: {
        mint: PublicKey;
        decimals: number;
    };
    baseAmount: BN;
    quoteAmount: BN;
    startTime: BN;
    ownerInfo: {
        useSOLBalance: boolean;
    };
}

export const createAmmPool = async ({
    marketId,
    baseMintInfo,
    quoteMintInfo,
    baseAmount,
    quoteAmount,
    startTime,
    ownerInfo,
}: CreateAmmPoolParams) => {
    const raydium = await initSdk();

    // Get market information
    const marketBufferInfo = await raydium.connection.getAccountInfo(marketId);
    const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo!.data);

    // Check mint info
    if (
        baseMintInfo.mint.toBase58() !== baseMint.toBase58() ||
        quoteMintInfo.mint.toBase58() !== quoteMint.toBase58()
    ) {
        throw new Error('Provided mint information does not match market data.');
    }

    if (
        baseMintInfo.mint.toBase58() !== TOKEN_PROGRAM_ID.toBase58() ||
        quoteMintInfo.mint.toBase58() !== TOKEN_PROGRAM_ID.toBase58()
    ) {
        throw new Error(
            'AMM pools with OpenBook market only support TOKEN_PROGRAM_ID mints. For token-2022, create a CPMM pool instead.'
        );
    }

    const { execute, extInfo } = await raydium.liquidity.createPoolV4({
        programId: AMM_V4,
        marketInfo: {
            marketId,
            programId: OPEN_BOOK_PROGRAM,
        },
        baseMintInfo: {
            mint: baseMintInfo.mint,
            decimals: baseMintInfo.decimals,
        },
        quoteMintInfo: {
            mint: quoteMintInfo.mint,
            decimals: quoteMintInfo.decimals,
        },
        baseAmount,
        quoteAmount,
        startTime,
        ownerInfo,
        associatedOnly: false,
        txVersion,
        feeDestinationId: FEE_DESTINATION_ID,
    });

    // Optionally, set sendAndConfirm to false if you don't want to wait for confirmation
    const { txId } = await execute({ sendAndConfirm: true });
    console.log(
        'AMM pool created! txId: ',
        txId,
        ', poolKeys:',
        Object.keys(extInfo.address).reduce(
            (acc, cur) => ({
                ...acc,
                [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
            }),
            {}
        )
    );
};

/** Uncomment code below to execute */
// createAmmPool({
//     marketId: new PublicKey('<your market id here>'),
//     baseMintInfo: {
//         mint: new PublicKey('<base mint address here>'),
//         decimals: 6,
//     },
//     quoteMintInfo: {
//         mint: new PublicKey('<quote mint address here>'),
//         decimals: 6,
//     },
//     baseAmount: new BN(1000),
//     quoteAmount: new BN(1000),
//     startTime: new BN(0),
//     ownerInfo: {
//         useSOLBalance: true,
//     },
// });
