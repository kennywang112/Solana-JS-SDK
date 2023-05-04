import styles from '../styles/Home.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair } from "@solana/web3.js";
import { nftStorage } from "@metaplex-foundation/js-plugin-nft-storage";//npm install @metaplex-foundation/js-plugin-nft-storage
import { useMetaplex } from "./useMetaplex";
import bs58 from "bs58";
import { clusterApiUrl, Connection } from '@solana/web3.js';
import {  getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

export const Claim_token= ({ onClusterChange }) => {
    const wallet = useWallet();
    const { metaplex } = useMetaplex();
    metaplex.use(nftStorage());
    const myWalletSecretKey = bs58.decode('2NPirTYggNg33osSYZQM9SmLGRYbfjQ3UC83rSXAsxQWumHWcnGachXZEEV2ZqHgrBfHYcRvHJ1CgnGTUvD6ycwP'); //私鑰轉回錢包keypair，帳戶名computer
    const checkEligibility = async () => {
    };
    const onClick = async () => {
        (async () => {
            // Connect to cluster
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
            // Generate a new wallet keypair and airdrop SOL
            const fromWallet = Keypair.fromSecretKey(myWalletSecretKey);

            // Create new token mint
            //const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
            const mint =new PublicKey('8n7GxVW3ce7vTJ8BDpuiFBfuJFUEdGcNj4cW6vhDS6qk')
            
            // Get the token account of the fromWallet address, and if it does not exist, create it
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                mint,
                fromWallet.publicKey
            );
        
            // Get the token account of the toWallet address, and if it does not exist, create it
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, wallet.publicKey);
        
            // Mint 0 new token to the "fromTokenAccount" account we just created
            let signature = await mintTo(
                connection,
                fromWallet,
                mint,
                fromTokenAccount.address,
                fromWallet.publicKey,
                0
            );
            console.log('mint tx:', signature);
        
            // Transfer the new token to the "toTokenAccount" we just created
            signature = await transfer(
                connection,
                fromWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                1000000000*50
            );
            console.log('finish transfer')
        })();
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
          <button onClick={onClick}>Claim</button>
          </div>
        </div>
      </div>
    </div>
  );
};
