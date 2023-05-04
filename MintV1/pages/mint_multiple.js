import styles from '../styles/Home.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from "@solana/web3.js";
import { nftStorage } from "@metaplex-foundation/js-plugin-nft-storage";//npm install @metaplex-foundation/js-plugin-nft-storage
import { useMetaplex } from "./useMetaplex";
import { mintFromCandyMachineBuilder } from '@metaplex-foundation/js';//多張nft

export const Multiple= ({ onClusterChange }) => {
  const wallet = useWallet();
  const wallet_Owner = new PublicKey('32XvyrStjEX7et4gcmVHU8c9rfQBaZVRkTzkAqZPNh5F')
  const wallet_twitter = new PublicKey('9oUpQVng7Wi6A6YpVKXjuU9MW2EsRU5RuNocLh98rhSL')
  const wallet_anchor_token = new PublicKey('AMhqQZwjhQjYRMPmqZZrVERnaPcQrcPSeSgp3bfQeXgk')
  const airdrop_list = [
    wallet_Owner,
    wallet_twitter,
    wallet_anchor_token
  ]
  const { signAllTransaction, signTransaction } = useWallet();
  const { metaplex } = useMetaplex();
  metaplex.use(nftStorage());

  const checkEligibility = async () => {
  };

  const onClick = async () => {
    const candyMachine = await metaplex
      .candyMachines()
      .findByAddress({
        address: new PublicKey('ENq8Gvnq7uFBwkgTNxPdq449g7SWrYpp8Ydzc9ztN9Uh')
      });
    const transactionBuilders = [];
    for (let index = 0; index < 3; index++) {//將交易存入交易陣列
      transactionBuilders.push(
        await mintFromCandyMachineBuilder(metaplex, {
          candyMachine,
          collectionUpdateAuthority: candyMachine.authorityAddress, // mx.candyMachines().pdas().authority({candyMachine: candyMachine.address})
          group: 'public',
          owner:airdrop_list[index]
        })
      );
      console.log('finish:',{index})
    }
    
    console.log('finish pushing mint amount')
    const blockhash = await metaplex.rpc().getLatestBlockhash();//取得最新的雜湊
    const transactions = transactionBuilders.map((t) =>
          t.toTransaction(blockhash)//轉換成實際交易，每筆都使用相同hash簽名
        );
    console.log('finish totransaction :',{transactions})
    const signers = {};
    transactions.forEach((tx, i) => {
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = blockhash.blockhash;
      transactionBuilders[i].getSigners().forEach((s) => {
        if ("signAllTransactions" in s) signers[s.publicKey.toString()] = s;
        else if ("secretKey" in s) tx.partialSign(s);
        // @ts-ignore
        else if ("_signer" in s) tx.partialSign(s._signer);
      });
    });
    let signedTransactions = transactions;
    console.log('your signed transaction :',{signedTransactions})
    for (let signer in signers) {//signers對所有進行簽名
      //await signers[signer].signAllTransactions(transactions);
      console.log('a')
    }
    console.log(signers)
    // const output = await Promise.all(
    //   signedTransactions.map(async (tx, i) => {
    //     const result = await metaplex.rpc().sendAndConfirmTransaction(tx, { commitment: "finalized" });
    //     return {
    //       ...result,
    //       context: transactionBuilders[i].getContext(),
    //     };
    //   })
    // );
    console.log('finish')
    
  };

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
            <button onClick={onClick}>Mint Multiple</button>
          </div>
        </div>
      </div>
    </div>
  );
};
