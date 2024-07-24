const axios = require('axios');
const Web3 = require('web3');
const OracleABI = require('./CustomOracle.json'); // ABI of the CustomOracle contract

const API_URL = 'https://api.geckoterminal.com/api/v2/networks/eth/tokens/0xdac17f958d2ee523a2206206994597c13d831ec7';
const ORACLE_ADDRESS = '0xYourOracleContractAddress';
const PRIVATE_KEY = '0xYourPrivateKey';
const RPC_URL = 'https://mainnet.infura.io/v3/your-infura-project-id'; // or any RPC endpoint of the target blockchain

async function fetchPriceAndUpdateOracle() {
    try {
        // Fetch price from API
        const response = await axios.get(API_URL);
        const price = response.data.data.attributes.price_usd;
        console.log(`Fetched price: $${price}`);

        // Initialize web3
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

        // Create contract instance
        const oracleContract = new web3.eth.Contract(OracleABI, ORACLE_ADDRESS);

        // Get the account
        const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        // Set the price in the oracle
        const priceInWei = web3.utils.toWei(price, 'ether'); // Assuming the oracle expects price in wei
        const setPriceData = oracleContract.methods.setPrice(priceInWei).encodeABI();

        const tx = {
            to: ORACLE_ADDRESS,
            data: setPriceData,
            gas: 200000, // Estimate gas limit
        };

        // Sign and send the transaction
        const signedTx = await account.signTransaction(tx);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

fetchPriceAndUpdateOracle();
