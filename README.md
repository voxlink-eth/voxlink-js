# voxlink-js
JavaScript library for Voxlink functions

## Usage

### Start ghostminting guided process
  `await Voxlink.ghostminting.start();`

### Verify ownership
  `var isOwner = await Voxlink.hasTokens(collectionAddress, walletAddress);`

### Start voxlink registration process
  `await Voxlink.register.start();`
