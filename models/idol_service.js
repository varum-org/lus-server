const mongose = require("mongoose");

const IdolServiceSchema = new mongose.Schema({
  service_id: {
    type: String,
    required: true,
  },
  idol_id: {
    type: String,
    required: true,
  },
  service_price: {
    type: Number,
    required: true,
  },
});

const IdolService = mongose.model("IdolService", IdolServiceSchema);
module.exports = IdolService;
