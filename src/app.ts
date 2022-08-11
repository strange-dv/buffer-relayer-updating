import * as anchor from "@project-serum/anchor";
import {
    Connection,
    Keypair,
} from "@solana/web3.js";
import {
    AnchorWallet, BufferRelayerAccount,
    getSwitchboardPid,
} from "@switchboard-xyz/switchboard-v2";


const payerKeypair = Keypair.fromSecretKey(
    Uint8Array.from(
        [12,195,146,14,186,66,34,116,175,165,145,117,231,77,109,234,208,5,60,71,2,152,14,42,101,153,40,53,14,194,118,120,188,44,120,209,25,250,192,31,11,243,162,104,10,144,60,159,191,5,141,96,119,38,254,219,69,44,139,38,12,254,85,112]
    )
);

const ACCOUNT = [198,210,90,164,173,154,2,4,9,95,117,233,217,98,227,232,192,47,201,236,117,251,125,197,191,174,48,195,149,30,53,158,175,225,199,21,81,77,34,142,31,66,252,75,210,102,216,199,77,52,84,23,183,190,55,199,148,77,96,151,129,26,246,52]


const main = async (buffer_relayer: number[]) => {
    const provider = new anchor.AnchorProvider(
        // https://api.mainnet.solana.com/  for mainnet
        new Connection("https://api.devnet.solana.com", {
            commitment: "confirmed",
        }),
        new AnchorWallet(payerKeypair),
        {
            commitment: "confirmed",
        }
    );

    const programId = getSwitchboardPid("devnet");  // "mainnet-beta" for mainnet

    const anchorIdl = await anchor.Program.fetchIdl(programId, provider);
    if (!anchorIdl) {
        throw new Error(`failed to read idl for ${programId}`);
    }

    const program = new anchor.Program(anchorIdl, programId, provider);

    const bufferAccount = new BufferRelayerAccount(
        {
            program: program,
            keypair: Keypair.fromSecretKey(
                Uint8Array.from(buffer_relayer)
            )
        }
    )

    const tx = await bufferAccount.openRound()
    console.log(`OpenRound TX: ${tx}`);
}


main(ACCOUNT).then( () => {
    console.log("Successfully updated!");
})
