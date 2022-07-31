import React, { useState } from "react";
import { create } from "ipfs-http-client";
import { useForm } from "react-hook-form";
import Web3 from "web3/dist/web3.min.js";
import "./styles.css"
// import {abi, networks} from "../../build/contracts/Warranty.json"
import Warranty from "../abis/Warranty.json";

const web3 = new Web3(
  Web3.givenProvider ||
    "https://polygon-mumbai.g.alchemy.com/v2/OnaCffRR7DUuOsGggeqnxXQ0dsSn-TWY"
);

export default function App() {
  const [isAutheticated, setAuthetication] = useState(false);
  const { register, handleSubmit } = useForm();
  const [myAccount, setMyAccount] = useState("");
  const [ethID, setEthID] = useState(0);
  const [abi, setABI] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [changeOwner, newOwner] = useState("");

  // Connecting to ipfs
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  async function auth() {
    if (window.ethereum) {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const account = accounts[0];

      setEthID(networkId);
      setMyAccount(account);
      const abi = Warranty.abi;
      const contractAddress = Warranty.networks[networkId].address;
      console.log(contractAddress);
      setABI(abi);
      setContractAddress(contractAddress);

      console.log("Connected to Ethereum");
      window.sessionStorage.setItem("authentication", true);
      setAuthetication(true);
    } else {
      alert("No Ethereum Window Detected!!");
    }
  }

  async function getYourData() {
    var contract = new web3.eth.Contract(abi, contractAddress);
    contract.setProvider(window.ethereum);
    console.log(contract);
    contract.methods.getData(myAccount).call(function (error, result) {
      console.log("getData = ", error, result);
    });
    contract.methods.getOwner().call(function (error, result) {
      console.log("Owner = ", error, result);
    });
  }

  async function sendToBlockchain(filedata) {
    var contract = new web3.eth.Contract(abi, contractAddress);
    contract.setProvider(window.ethereum);
    console.log(ethID);
    contract.methods.getFileCount().call(function (error, result) {
      const fileCount = parseInt(result);

      console.log(typeof fileCount, fileCount);
      contract.methods
        .uploadFile(
          myAccount,
          filedata.URL,
          filedata.Name,
          filedata.Price,
          filedata.Size,
          filedata.Description,
          filedata.WarrantyTime
        )
        .send({ from: myAccount }, function (error, transactionHash) {
          console.log("uploading=", error, transactionHash);
        });
    });
  }

  async function onSubmit(data) {
    const description = data.description;
    const price = data.price;
    const warrantyTime = data.warrantyTime;
    const file = data.file[0];
    const fileArray = await file.arrayBuffer();
    const fileByteData = [...new Uint8Array(fileArray)];
    console.log(description);
    console.log(price);
    console.log(fileByteData);
    try {
      const added = await ipfs.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      var filedata = {
        URL: url,
        Name: file.name,
        Size: file.size,
        Price: price,
        Description: description,
        WarrantyTime: warrantyTime,
      };
      console.log(filedata);
      await sendToBlockchain(filedata);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function transferOwner(data) {
    data.preventDefault();
    console.log("owner=", changeOwner);
    var contract = new web3.eth.Contract(abi, contractAddress);
    contract.setProvider(window.ethereum);
    console.log("transfering Ownership");
    contract.methods
      .transferOwner(changeOwner, 1)
      .send({ from: myAccount }, function (error, result) {
        console.log("transfer status = ", error, result);
        newOwner("");
      });
  }

  async function disconnect() {
    // window.sessionStorage.setItem("authentication", false);
    setAuthetication(false);
    console.log("Disconnected");
  }

  return (
    <div className="App">
      {!isAutheticated && <button onClick={auth}>Login</button>}

      {isAutheticated && (
        <div>
          <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
            <p className="text-3xl text-gray-700 font-bold mb-5">Welcome!</p>
            <p className="text-gray-500 text-lg">
              React and Tailwind CSS in action
            </p>
            <form noValidate="" autoComplete="off">
              <label className="">Upload your file</label>
              <input
                type="text"
                id="description"
                placeholder="Description of the Dress"
                {...register("description", { required: true })}
              ></input>
              <input
                type="number"
                id="price"
                placeholder="Price of Dress"
                {...register("price", { required: true })}
              ></input>
              <input
                type="number"
                id="warrantyTime"
                placeholder="Enter in years"
                {...register("warrantyTime", { required: true })}
              ></input>
              <input
                type="file"
                id="file"
                className="file"
                {...register("file", { required: true })}
              />
              <br />

              <button type="submit" onClick={handleSubmit(onSubmit)}>
                submit
              </button>
            </form>
          </div>
          <br></br>
          <button onClick={getYourData}>get My Dresses</button>
          <br></br>
          <form>
            <input
              type="text"
              id="owner"
              name="owner"
              placeholder="Enter the new Owner Hash"
              onChange={(event) => newOwner(event.target.value)}
              value={changeOwner}
            ></input>
            <button type="submit" onClick={transferOwner}>
              Change Owner
            </button>
          </form>
          <button onClick={disconnect}>Logout</button>
        </div>
      )}
    </div>
  );
}

// export default App;
