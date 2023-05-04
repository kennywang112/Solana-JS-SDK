import styles from '../styles/Home.module.css';
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair,LAMPORTS_PER_SOL, Connection, clusterApiUrl } from "@solana/web3.js";
import { nftStorage } from "@metaplex-foundation/js-plugin-nft-storage";//npm install @metaplex-foundation/js-plugin-nft-storage
import { useMetaplex } from "./useMetaplex";
import { getAccount,getMint,createMint,mintTo,getOrCreateAssociatedTokenAccount,transfer,createCreateMetadataAccountV2Instruction  } from '@solana/spl-token';
import bs58 from "bs58";

export const Create_token= ({ onClusterChange }) => {
    const wallet = useWallet();
    const { metaplex } = useMetaplex();
    metaplex.use(nftStorage());
    const toAccount= new PublicKey('32XvyrStjEX7et4gcmVHU8c9rfQBaZVRkTzkAqZPNh5F');//owner
    const myWalletSecretKey = bs58.decode('2NPirTYggNg33osSYZQM9SmLGRYbfjQ3UC83rSXAsxQWumHWcnGachXZEEV2ZqHgrBfHYcRvHJ1CgnGTUvD6ycwP'); //私鑰轉回錢包keypair，帳戶名computer
    const Authority = Keypair.fromSecretKey(myWalletSecretKey);
    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed'
      );
    const checkEligibility = async () => {
    };

    const onClick = async () => {  
        const { uri } = await metaplex.nfts().uploadMetadata({
          name: "KToken",
          symbol: "TEST",
          description: "This is Kenny Token",
          image: "https://arweave.net/123",
          });
        const mint = await createMint(
          connection,
          Authority,
          Authority.publicKey,
          Authority.publicKey,
          9, // We are using 9 to match the CLI decimal default exactly
        );
        console.log('token now is 0 supply:',mint.toBase58());
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            Authority,
            mint,
            Authority.publicKey
          )
        let signature = await mintTo(
            connection,
            Authority,
            mint,
            tokenAccount.address,
            Authority.publicKey,
            100000000000 // because decimals for the mint are set to 9 
          )
        
        const mintInfo = await getMint(
            connection,
            mint
          )
        const tokenAccountInfo = await getAccount(
            connection,
            tokenAccount.address
          )
        console.log('mint tx:', signature);
        console.log('finish :',mintInfo.supply);
        console.log('your token balance :',tokenAccountInfo.amount);
    }
    const onClick2 = async () => {

    const myWalletSecretKey = bs58.decode('2NPirTYggNg33osSYZQM9SmLGRYbfjQ3UC83rSXAsxQWumHWcnGachXZEEV2ZqHgrBfHYcRvHJ1CgnGTUvD6ycwP');
    const fromWallet = Keypair.fromSecretKey(myWalletSecretKey);
    const anotherWalletSecretKey = bs58.decode('5TSZFEbrtfs3YojcmJVeBYT5sHKmY9ZxQ894TXMqLhCduyVHrCP5WJiekYXSNtTomQ8DsoitJMdX2Bx1pciXnoLq');
    const toWallet = Keypair.fromSecretKey(anotherWalletSecretKey);

    // Create new token mint
    const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet.publicKey);

    // Mint 1 new token to the "fromTokenAccount" account we just created
    let signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1000000000
    );
    console.log('mint tx:', signature);

    // Transfer the new token to the "toTokenAccount" we just created
    signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        50
    );
    console.log('mint tx:', signature)
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
            <button onClick={onClick}>create token</button>
            <button onClick={onClick2}>transfer token</button>
          </div>
        </div>
      </div>
    </div>
  );
};
