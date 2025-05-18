import React, { useEffect, useState } from "react";
import { RpcProvider, Contract } from "starknet";
import "./App.css";

const CONTRACT_ADDRESS = "0x5c1f11da70abcd9c67c0aa01af23ae7962c6720b3d3b8646b5caf9231f712c3";

const ABI = [
  {
    "name": "abc",
    "type": "impl",
    "interface_name": "___testsingle::ICounterContract"
  },
  {
    "name": "___testsingle::ICounterContract",
    "type": "interface",
    "items": [
      {
        "name": "get_counter",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "increase_counter",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "x",
        "type": "core::integer::u32"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "___testsingle::Cont::Event",
    "type": "event",
    "variants": []
  }
];

const rpc = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/FCyLgvgy4q9oa_OScl33IgtjRYHNr1gP",
});

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [counter, setCounter] = useState(null);
  const [contract, setContract] = useState(null);

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
      setAccountAddress(account.address);
      console.log("Wallet connected:", account.address);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const fetchCounter = async () => {
    if (!contract) return;
    try {
      const contract = new Contract(ABI, CONTRACT_ADDRESS, rpc);
      const res = await contract.get_counter();
      setCounter((res.toString(10)));
      alert(`Counter: ${res.toString(10)}`);
      console.log("Counter fetched:", res.toString(10));
    } catch (err) {
      console.error("Failed to fetch counter:", err);
    }
  };

  const increaseCounter = async () => {
    if (!contract) return;
    try {
      const tx = await contract.increase_counter();
    
      console.log("Tx hash:", tx.transaction_hash);
      await rpc.waitForTransaction(tx.transaction_hash);
         fetchCounter();
       
    } catch (err) {
      console.error("Increase counter failed:", err);
    }
  };

  const sliceAddress = (addr) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  };

  return (
    <div className="App">
      <h1>StarkNet Counter</h1>

      {!walletConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {sliceAddress(accountAddress)}</p>
          <button onClick={fetchCounter}>Get Counter</button>
          <p>Counter: {counter !== null ? counter : "Not fetched"}</p>
          <button onClick={increaseCounter}>Increase Counter</button>
        </>
      )}
    </div>
  );
}

export default App;
