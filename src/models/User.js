const { Schema, model } = require("mongoose");

const schema = new Schema({
  auth: {
    type: {
      standard: {
        type: {
          email: {
            type: String,
            unique: true
          },
          password: {
            type: String
          }
        },
        default: null
      },
      vk: {
        type: {
          id: {
            type: Number,
            unique: true
          }
        },
        default: null
      },
      google: {
        type: {
          email: {
            type: String,
            unique: true
          },
          default: null
        }
      }
    },
    default: null
  },
  roles: [String],
  level: {
    type: Number,
    default: 0
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("User", schema);
