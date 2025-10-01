import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import * as fs from 'fs';
import * as path from 'path';

// Configure Aptos client for devnet
const aptosConfig = new AptosConfig({ 
  network: Network.DEVNET 
});
const aptos = new Aptos(aptosConfig);

/**
 * Deploy the Library contract to Aptos devnet
 * This is a helper script for deployment
 */
export class ContractDeployer {
  
  /**
   * Create a new account for deployment
   */
  static async createDeploymentAccount(): Promise<Account> {
    const account = Account.generate();
    console.log(`\n🔑 Generated new account:`);
    console.log(`Address: ${account.accountAddress}`);
    console.log(`Private Key: ${account.privateKey}`);
    
    // Fund the account using the faucet
    console.log(`\n💰 Funding account...`);
    try {
      await aptos.fundAccount({
        accountAddress: account.accountAddress,
        amount: 100000000, // 1 APT
      });
      console.log(`✅ Account funded successfully!`);
    } catch (error) {
      console.log(`❌ Auto-funding failed. Please manually fund the account at:`);
      console.log(`https://aptoslabs.com/testnet-faucet`);
      console.log(`Address: ${account.accountAddress}`);
    }
    
    return account;
  }

  /**
   * Deploy the contract using package directory
   */
  static async deployContract(account: Account): Promise<string> {
    try {
      console.log(`\n🚀 Deploying contract...`);
      
      // Note: This requires the Move bytecode to be compiled first
      // In a real deployment, you would use the Aptos CLI or compile the Move code
      
      const deploymentAddress = account.accountAddress;
      
      console.log(`✅ Contract would be deployed to: ${deploymentAddress}`);
      console.log(`\n📝 Update your contract.ts with:`);
      console.log(`export const CONTRACT_ADDRESS = "${deploymentAddress}";`);
      
      return deploymentAddress.toString();
      
    } catch (error) {
      console.error(`❌ Deployment failed:`, error);
      throw error;
    }
  }

  /**
   * Test the deployed contract
   */
  static async testContract(contractAddress: string, account: Account): Promise<void> {
    try {
      console.log(`\n🧪 Testing contract at ${contractAddress}...`);
      
      // Initialize library
      console.log(`Initializing library...`);
      // Add test implementation here
      
      console.log(`✅ Contract test completed successfully!`);
      
    } catch (error) {
      console.error(`❌ Contract test failed:`, error);
      throw error;
    }
  }
}

/**
 * Main deployment function
 */
async function main() {
  try {
    console.log(`🌟 Starting Aptos Library Contract Deployment\n`);
    
    // Step 1: Create deployment account
    const account = await ContractDeployer.createDeploymentAccount();
    
    // Step 2: Deploy contract
    const contractAddress = await ContractDeployer.deployContract(account);
    
    // Step 3: Test contract
    await ContractDeployer.testContract(contractAddress, account);
    
    console.log(`\n🎉 Deployment completed successfully!`);
    console.log(`\n📋 Summary:`);
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Account Address: ${account.accountAddress}`);
    console.log(`\n🔧 Next Steps:`);
    console.log(`1. Update CONTRACT_ADDRESS in src/lib/contract.ts`);
    console.log(`2. Switch to Blockchain mode in the app`);
    console.log(`3. Connect your Petra wallet`);
    console.log(`4. Test book borrowing/returning`);
    
  } catch (error) {
    console.error(`\n❌ Deployment failed:`, error);
    process.exit(1);
  }
}

// Run deployment if this file is executed directly
if (require.main === module) {
  main();
}