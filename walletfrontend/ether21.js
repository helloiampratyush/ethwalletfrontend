import { ethers } from "./etherhelper.js";
import { abi, contractAddress } from "./constant.js";
//connecting all button of html to javascript
const connectButton = document.getElementById("connect-button");
const depositeButton = document.getElementById("deposite-button");
const withdrawButton = document.getElementById("withdraw-button");
const balanceButton = document.getElementById("balance-button");
const detailButton = document.getElementById("addresstoAmount");
const yourFund = document.getElementById("your-amount");
console.log("connecting complete");
console.log("connecting variable with their repective function");
connectButton.onclick = connect;
depositeButton.onclick = deposite;
withdrawButton.onclick = withDraw;
balanceButton.onclick = balance;
detailButton.onclick = getFundDetail;
yourFund.onclick = yourfund1;
console.log("confirming connection");
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connect-button").innerHTML = "connected";
  } else {
    document.getElementById("connect-button").innerText =
      "require to install metamask";
    console.log("install metamask");
  }
}
async function deposite() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.deposite({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("please install metamask");
  }
}
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`mining ${transactionResponse.hash}.....`);
  //listen for transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function withDraw() {
  const ethamount1 = document.getElementById("ethAmount1").value;
  console.log(`Withdrawing...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw(ethamount1);
      await listenForTransactionMine(transactionResponse, provider);
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error);
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
}
async function balance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
    document.getElementById("ethAmount3").value =
      ethers.utils.formatEther(balance);
  }
}
async function getFundDetail() {
  const ethamount2 = document.getElementById("ethAmount2").value;
  console.log("request processing");
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.getAmountSent(ethamount2);
      // await transactionResponse.wait(1)
      console.log(ethers.utils.formatEther(transactionResponse));
    } catch (error) {
      console.log(error);
    }
  }
}
async function yourfund1() {
  console.log("request processing");
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.youramount();
      // await transactionResponse.wait(1)
      console.log(ethers.utils.formatEther(transactionResponse));
      document.getElementById("ethAmount4").value =
        ethers.utils.formatEther(transactionResponse);
    } catch (error) {
      console.log(error);
    }
  }
}
