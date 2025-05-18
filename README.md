

---


# 🚀 Full-Stack StarkNet dApp with Cairo 1.0 and React

## 🧠 Introduction

As blockchain scalability becomes increasingly important, Layer 2 solutions are gaining momentum. Among them, **StarkNet** stands out due to its use of zero-knowledge proofs (ZK-STARKs) to enable scalable and secure computations. However, StarkNet development involves a unique stack — from Cairo smart contracts to frontend integration via StarkNet.js.

In this project, I learned how to:

- Write a **Cairo 1.0 smart contract** with access control.
- Deploy it on the **StarkNet testnet**.
- Build a frontend using **React**.
- Connect it to wallets like **Argent X** or **Braavos**.
- Interact with the contract using **StarkNet.js**.

---

## 🧱 Cairo Smart Contract

Only the **contract owner** can increment the counter, while anyone can view it.

### 🔒 Contract Code (Cairo 1.0)

```rust
#[starknet::interface]
trait ICounterContract<TContractState> {
    fn get_counter(self: @TContractState) -> u32;
    fn increase_counter(ref self: TContractState);
}

#[starknet::contract]
mod counter {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::get_caller_address;
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        counter: u32,
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, x: u32, owner: ContractAddress) {
        self.counter.write(x);
        self.owner.write(owner);
    }

    #[abi(embed_v0)]
    impl abc of super::ICounterContract<ContractState> {
        fn get_counter(self: @ContractState) -> u32 {
            self.counter.read()
        }

        fn increase_counter(ref self: ContractState) {
            let caller = get_caller_address();
            let owner = self.owner.read();
            assert(caller == owner, 'Owner can only call');
            let current = self.counter.read();
            self.counter.write(current + 1);
        }
    }
}
```

### 🔍 Key Features

* **Access Control**: Only the contract owner can increment the counter.
* **Public View**: Anyone can read the counter value.
* **Constructor**: Initializes the counter and sets the owner.

> Compile with **Scarb** and deploy using **starkli**.

---

## 🌐 React Frontend

### 🛠 Tech Stack

* **React** for UI
* **StarkNet.js** for smart contract interaction
* **RpcProvider** for reading data
* **window\.starknet** for wallet integration

### 📁 Setup

```bash
npx create-react-app starknet-dapp
cd starknet-dapp
npm install starknet
```

### 💻 React Code

```jsx
import React, { useEffect, useState } from "react";
import { RpcProvider, Contract } from "starknet";

const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS"; // Replace with actual address
const ABI = [/* ABI JSON here */];

const rpc = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/YOUR_API_KEY",
});

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [counter, setCounter] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  const connectWallet = async () => {
    if (!window.starknet) {
      alert("Install Argent X or Braavos");
      return;
    }

    try {
      await window.starknet.enable();
      const account = window.starknet.account;
      const ctr = new Contract(ABI, CONTRACT_ADDRESS, account);
      setContract(ctr);
      setWalletConnected(true);
      setUserAddress(account.address.slice(0, 6) + "..." + account.address.slice(-4));
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const fetchCounter = async () => {
    try {
      const readContract = new Contract(ABI, CONTRACT_ADDRESS, rpc);
      const res = await readContract.get_counter();
      setCounter(res.toString(10));
    } catch (err) {
      console.error("Failed to fetch counter:", err);
    }
  };

  const increaseCounter = async () => {
    try {
      const tx = await contract.increase_counter();
      await rpc.waitForTransaction(tx.transaction_hash);
      fetchCounter();
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <div className="App">
      <h1>StarkNet Counter</h1>
      {!walletConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {userAddress}</p>
          <button onClick={fetchCounter}>Get Counter</button>
          <p>Counter: {counter !== null ? counter : "Not fetched"}</p>
          <button onClick={increaseCounter}>Increase Counter</button>
        </>
      )}
    </div>
  );
}

export default App;
```

---

## 🔄 Interaction Flow

1. **Connect Wallet**
   → Calls `window.starknet.enable()` and uses the wallet's account.

2. **Read Counter**
   → Uses `RpcProvider` and a read-only contract instance.

3. **Write to Counter**
   → Uses a connected wallet to send a transaction with `increase_counter()`.

---

## ✅ Deployment & Testing

* Use **starkli** to deploy and test.
* Check contract status on [Voyager](https://voyager.online/).
* Use **StarkNet.js** docs for further integration help.

---

## 📚 Learnings & Best Practices

* **Split Read/Write**: Use `RpcProvider` for read-only ops.
* **Wallet Integration**: Keep support for Argent X and Braavos.
* **Error Handling**: Wrap async calls with `try/catch`.
* **Clean ABIs**: Simplify or flatten when needed.

---

## 📸 Screenshots

| Action           | Preview                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Connect Wallet   | ![Connect Wallet](https://github.com/user-attachments/assets/8e4d6609-df4c-4ada-b53e-451755073976) |
| App Interface    | ![Interface](https://github.com/user-attachments/assets/daf4dd44-3f98-4e4e-93cd-f42f176fcf6a)      |
| Get Counter      | ![Read](https://github.com/user-attachments/assets/51e7fcf7-3c3e-4c5e-8d49-8dd05c928d6d)           |
| Increase Counter | ![Write](https://github.com/user-attachments/assets/41b23f59-4f2c-40b8-878a-1db93ba1869c)          |

---

## 🧾 Conclusion

With the rise of ZK-powered Layer 2s, **StarkNet** offers a powerful and developer-friendly ecosystem for scalable dApps.

You just:

✅ Wrote a secure Cairo contract
✅ Deployed it on StarkNet testnet
✅ Built a full React frontend
✅ Integrated wallet connectivity
✅ Interacted using StarkNet.js

---


