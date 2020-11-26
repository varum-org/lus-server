const mongose = require("mongoose");

const ServiceSchema = new mongose.Schema({
  service_code: {
    type: Number,
    required: true,
  },
  service_name: {
    type: String,
    required: true,
  },
  service_description: {
    type: String,
    required: true,
  },
});

const Service = mongose.model("Service", ServiceSchema);
module.exports = Service;
