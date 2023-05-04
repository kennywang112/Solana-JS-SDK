import styles from '../styles/Home.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { some , transactionBuilder , publicKey , generateSigner , none , sol , dateTime , percentAmount , base58PublicKey,signAllTransactions,addTransactionSignature, signerIdentity } from "@metaplex-foundation/umi";
import { fetchCandyMachine , fetchCandyGuard , mintV2, updateCandyGuard , mplCandyMachine , updateCandyMachine , create , mintFromCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { setComputeUnitLimit , createMintWithAssociatedToken } from "@metaplex-foundation/mpl-essentials";
import { TokenStandard, collectionDetailsToggleBeet } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";
export const Vthree= ({ onClusterChange }) => {
  
    const wallet = useWallet();
    //const umi = createUmi(clusterApiUrl('devnet'),'confirmed').use(mplCandyMachine());
    const umi = createUmi('https://api.devnet.solana.com')
    .use(walletAdapterIdentity(wallet))
    .use(nftStorageUploader())
    .use(mplCandyMachine());

    const checkEligibility = async () => {
        const candyMachine = await fetchCandyMachine(umi, publicKey("4w6LVTrtLCfiooe1sNzUD7W8NAYXJ3KBSGv8RT4RsNKb"));
        const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
        // console.log(base58PublicKey(candyMachine.publicKey))
        // console.log(base58PublicKey(candyMachine.collectionMint))
        // console.log(base58PublicKey(candyMachine.authority))
        // console.log(base58PublicKey(candyMachine.mintAuthority))
        console.log(candyMachine)
    };

    const onClick = async () => {
        
        const candyMachine = await fetchCandyMachine(umi, publicKey("4w6LVTrtLCfiooe1sNzUD7W8NAYXJ3KBSGv8RT4RsNKb"));
        const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
        
            await updateCandyGuard(umi, {
            candyGuard: candyGuard.publicKey,

            guards: {
                tokenStandard: TokenStandard.NonFungible,
                botTax: none(),
                collectionUpdateAuthority: publicKey('9MMdJHMK22JtrU8H4QLFYgZUoFcwXtutvjtrVNcjcRc9'),
                creators: [
                    { address: publicKey("99crpNweSPYkQeyU9i93GMyFyMedetoTG25jLQg11ruB"), percentageShare: 100, verified: false },
                    ],
                solPayment: some({ lamports: sol(0.02),destination: umi.identity.publicKey }),
                },
            groups: [
                // {
                //     label: "og",
                //     guards: {
                //         startDate: some({ date: dateTime("2022-10-18T16:00:00Z") }),
                //         solPayment: some({ lamports: sol(0.01), destination : treasury }),
                //     //mintLimit: some({ id: 1, limit: 5 }),
                //     },
                // },
                // {
                //     label: "public",
                //     guards: {
                //         startDate: some({ date: dateTime("2022-10-18T17:00:00Z") }),
                //         solPayment: some({ lamports: sol(0.02), destination : treasury }),
                //     //mintLimit: some({ id: 2, limit: 5 }),
                //     },
                // },
                ],
            }).sendAndConfirm(umi);
        console.log(candyMachine)
        console.log(candyGuard)
        await updateCandyMachine(umi, {
            candyMachine: candyMachine.publicKey,
            data: {
                ...candyMachine.data,
                sellerFeeBasisPoints: percentAmount(80, 2),
            },
            }).sendAndConfirm(umi);
        console.log('finish')
          
    };

    const onClick2 = async () => {
        
        //const candyMachine = await fetchCandyMachine(umi, publicKey("7f7EHekWrmH2dTddqz9PzQNj54w4DoBJKhG2m9qwiSRG"));
        const candyMachine = await fetchCandyMachine(umi, publicKey("4w6LVTrtLCfiooe1sNzUD7W8NAYXJ3KBSGv8RT4RsNKb"));
        const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);

        const nftMint = generateSigner(umi);
        const tx = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: publicKey(umi.identity) }))
        .add(
            mintV2(umi,{
            candyMachine: candyMachine.publicKey,
            nftMint: nftMint,
            collectionMint: candyMachine.collectionMint,//Collection NFT 的鑄幣賬戶地址
            collectionUpdateAuthority: candyMachine.authority, 
            //group: some("public"),
            candyGuard:candyGuard.publicKey,
            tokenStandard: TokenStandard.ProgrammableNonFungible,
            mintArgs: {
                mintLimit: some({ id: 1 }),
                solPayment: some({ destination: publicKey('9MMdJHMK22JtrU8H4QLFYgZUoFcwXtutvjtrVNcjcRc9') }),
            },
        })
        )
        console.log(tx)
        const { signature } = await tx.sendAndConfirm(umi, {
            confirm: { commitment: "finalized" }, send: {
                skipPreflight: true,
            },
            });
        console.log('完成')
        
    };

    const onClick3 = async () => {
        const candyMachine = await fetchCandyMachine(umi, publicKey("4w6LVTrtLCfiooe1sNzUD7W8NAYXJ3KBSGv8RT4RsNKb"));
        const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
        const transactionBuilders = [];
        const transactions = [];
        const signers = [];
        for (let index = 0; index < 2; index++) {
            const nftMint = generateSigner(umi);
            signers.push(nftMint)
            transactionBuilders.push(
                transactionBuilder()
                .add(setComputeUnitLimit(umi, { units: 800_000 }))
                .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: publicKey(umi.identity) }))
                .add(
                    mintV2(umi,{
                    candyMachine: candyMachine.publicKey,
                    nftMint: nftMint,
                    collectionMint: candyMachine.collectionMint,//Collection NFT 的鑄幣賬戶地址
                    collectionUpdateAuthority: candyMachine.authority, 
                    //group: some("public"),
                    candyGuard:candyGuard.publicKey,
                    tokenStandard: TokenStandard.ProgrammableNonFungible,
                    mintArgs: {
                        mintLimit: some({ id: 1 }),
                        solPayment: some({ destination: publicKey('9MMdJHMK22JtrU8H4QLFYgZUoFcwXtutvjtrVNcjcRc9') }),
                    },
                }))
            );
            transactionBuilders[index] = await transactionBuilders[index].setLatestBlockhash(umi);
            transactionBuilders[index] = transactionBuilders[index].setFeePayer(umi.identity);

            transactions.push(
                umi.transactions.create({
                    version:0,
                    blockhash:(await umi.rpc.getLatestBlockhash()).blockhash,
                    instructions:transactionBuilders[index].getInstructions(umi),
                    payer:publicKey(umi.identity)
                }))
            }
        const transactionsToSign = [];
        for (let i = 0; i < transactions.length; i++) {
            const newsigner = generateSigner(umi);
            transactionsToSign.push(
            { transaction: transactions[i], signers:[signers[i],umi.identity] }
            );
        }
        const signedTransactions = await signAllTransactions(transactionsToSign);
        const output = await Promise.all(
            signedTransactions.map(async (tx) => {
                const signature = await umi.rpc.sendTransaction(tx,{skipPreflight:false,maxRetries:5});
                const confirmResult = await umi.rpc.confirmTransaction(signature, {
                strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) }
                }); 
                return {
                ...confirmResult,
                };
            })
            );
        console.log('finish')
    }

    if (!wallet.connected) {
        return null;
    }else {
        checkEligibility();
    }

    return (
        <div>
        <div>
            <div className={styles.container}>
            <div className={styles.nftForm}>
                <button onClick={onClick}>更新</button>
                <button onClick={onClick2}>mintv2</button>
                <button onClick={onClick3}>update</button>
            </div>
            </div>
        </div>
        </div>
    );
};