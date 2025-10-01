# 🚀 Aptos Smart Contract Deployment Guide

## Option 1: Install Aptos CLI (Recommended)

### Windows Installation
1. **Download the Aptos CLI**:
   ```powershell
   # Method 1: Using Chocolatey (if you have it)
   choco install aptos
   
   # Method 2: Direct download
   # Go to: https://github.com/aptos-labs/aptos-core/releases
   # Download the latest Windows binary (aptos-cli-*-Windows-x86_64.zip)
   # Extract and add to your PATH
   ```

2. **Alternative: Using Cargo (Rust)**:
   ```powershell
   # Install Rust first: https://rustup.rs/
   cargo install --git https://github.com/aptos-labs/aptos-core.git aptos --branch devnet
   ```

### Quick Deploy Steps (After Installing CLI)
```powershell
# Navigate to project
cd "C:\Users\amitr\OneDrive\Desktop\aptos-book-vault-main (4)\aptos-book-vault-main"

# Initialize Aptos profile
aptos init

# Deploy the contract
aptos move publish --package-dir ./contracts
```

## Option 2: Use Aptos Online IDE (Easiest)

1. **Go to**: https://explorer.aptoslabs.com/account/modules/create?network=devnet
2. **Copy the Library.move content** from `contracts/sources/Library.move`
3. **Paste it in the online editor**
4. **Deploy directly** using the web interface
5. **Copy the deployed contract address**

## Option 3: Pre-deployed Contract (Quick Start)

I'll provide you with a sample deployed contract address for testing:

### Sample Contract Address
```
0x742d35cc6ba4e4e3b5b6c4de5f7f8b9c8a7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2
```

*Note: This is a placeholder. You'll need to deploy your own contract for production use.*

## 🔧 Manual Deployment Instructions

If you want to deploy manually, follow these steps:

### Step 1: Create Aptos Account
```javascript
// You can create an account using the Aptos SDK
// This is already set up in your project
```

### Step 2: Fund Your Account
- Go to: https://aptoslabs.com/testnet-faucet
- Get devnet APT tokens for deployment

### Step 3: Deploy Using SDK
```typescript
// Add this function to your contract.ts for deployment
static async deployContract(account: Account): Promise<string> {
  // Contract deployment code here
}
```

## ⚡ Quick Fix for Testing

If you want to test blockchain functionality immediately, I can:

1. **Deploy a test contract** for you
2. **Update your contract address** 
3. **Enable blockchain mode** immediately

Would you like me to proceed with any of these options?

## 📋 Next Steps

1. Choose your preferred deployment method
2. Deploy the contract
3. Update the CONTRACT_ADDRESS in your code
4. Test the blockchain functionality

Let me know which option you'd prefer, and I'll help you implement it!