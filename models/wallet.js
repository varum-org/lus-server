const mongose = require("mongoose");

const WalletSchema = new mongose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Wallet = mongose.model("Wallet", WalletSchema);
module.exports = Wallet;
