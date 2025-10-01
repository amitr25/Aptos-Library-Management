# 🎯 Real Petra Wallet Transactions - Testing Guide

## ✅ What Changed

I've updated your Aptos Book Vault to trigger **real Petra wallet transactions** on Aptos devnet! Here's what's now working:

### 🔧 **Technical Implementation**
- ✅ **Real Transactions**: Uses `0x1::coin::transfer` to create actual devnet transactions
- ✅ **Petra Integration**: Properly interfaces with Petra wallet extension
- ✅ **Explorer Links**: Direct links to Aptos devnet explorer
- ✅ **Error Handling**: Helpful error messages for common issues
- ✅ **Network Checking**: Validates devnet connection

### 📋 **How to Test Real Transactions**

#### **Step 1: Prepare Your Wallet**
1. **Install Petra Wallet**: https://petra.app/
2. **Switch to Devnet**: 
   - Open Petra → Settings → Network → Select "Devnet"
3. **Get Devnet APT**: 
   - Go to: https://aptoslabs.com/testnet-faucet
   - Enter your wallet address
   - Request devnet APT tokens

#### **Step 2: Connect and Test**
1. **Open the App**: http://localhost:8080
2. **Switch to Blockchain Mode**: Click the "Switch to Blockchain" button
3. **Connect Petra Wallet**: Click "Connect Petra Wallet"
4. **Try Borrowing a Book**: Click "Borrow Book" on any available book

#### **Step 3: What You'll See**
1. **Petra Popup**: Wallet will show transaction details
2. **Transaction Fee**: Small amount (< 0.001 APT)
3. **Confirmation**: App shows success message
4. **Explorer Link**: Click "View on Explorer" to see transaction

## 🚀 **Expected User Flow**

### **When You Borrow a Book:**
```
1. Click "Borrow Book" 
   ↓
2. Petra wallet popup appears
   ↓  
3. Review and approve transaction
   ↓
4. Transaction submits to devnet
   ↓
5. Success message with explorer link
   ↓
6. Book marked as borrowed in UI
```

### **Real Transaction Details:**
- **Function**: `0x1::coin::transfer`
- **Amount**: 1 octa (0.00000001 APT)
- **Purpose**: Creates real transaction while minimal cost
- **Network**: Aptos Devnet
- **Explorer**: https://explorer.aptoslabs.com

## ⚠️ **Troubleshooting**

### **Common Issues & Solutions:**

#### **1. "Petra wallet not found"**
```
Solution: Install Petra wallet extension
- Go to: https://petra.app/
- Install browser extension
- Create or import wallet
```

#### **2. "Insufficient funds"**
```
Solution: Get devnet APT tokens
- Visit: https://aptoslabs.com/testnet-faucet
- Enter your wallet address
- Request tokens (may take a few minutes)
```

#### **3. "Transaction was rejected"**
```
Solution: User cancelled transaction
- Try again and click "Approve" in Petra
- Check that you're on devnet network
```

#### **4. "Wrong network"**
```
Solution: Switch to devnet
- Open Petra → Settings → Network
- Select "Devnet" 
- Refresh the app
```

## 🔍 **Verify Real Transactions**

### **Check in Petra Wallet:**
1. Open Petra wallet
2. Go to "Activity" tab
3. See your recent transactions

### **Check on Explorer:**
1. Click "View on Explorer" link from success message
2. Or go to: https://explorer.aptoslabs.com
3. Search for your transaction hash
4. See full transaction details

### **Check Your Balance:**
- Your APT balance will decrease slightly (transaction fees)
- Each transaction costs ~0.0001 APT

## 🎉 **Success Indicators**

You'll know it's working when you see:
- ✅ Petra wallet popup for transaction approval
- ✅ Success message in the app
- ✅ "View on Explorer" link that works
- ✅ Transaction appears in Petra wallet activity
- ✅ Transaction visible on Aptos explorer
- ✅ Your APT balance decreases slightly

## 🌟 **Next Level Features**

Once this is working, you can enhance with:
- Deploy actual Library smart contract
- Use real book borrowing functions
- Add NFT integration for book ownership
- Implement user reputation system
- Add book lending fees

## 🔗 **Useful Links**

- **Petra Wallet**: https://petra.app/
- **Devnet Faucet**: https://aptoslabs.com/testnet-faucet
- **Aptos Explorer**: https://explorer.aptoslabs.com
- **Aptos Docs**: https://aptos.dev/

---

**Ready to test? Switch to blockchain mode and try borrowing a book! 🚀**