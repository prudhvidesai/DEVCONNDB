const express = require("express");

const { userAuth } = require("../middlewares/auth");

const User = require("../models/user");

const connectionRequestModel = require("../models/connectionRequests");

const requestRouter = express.Router();

requestRouter.post(
  "/connectionRequest/send/:toUserId/:status",
  userAuth,
  async (req, res) => {
    const user = req.user[0];
    console.log(user);
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    console.log(fromUserId);
    try {
      const toUser = await User.findById({ _id: toUserId });
      if (!toUser) {
        throw new Error("User not found in the DB!!!!");
      }

      const allowedStatus = ["Ignored", "Interested"];
      const isStatusValid = allowedStatus.includes(status);
      if (!isStatusValid) {
        throw new Error("Invalid Status" + " " + status);
      }

      const isConnExists = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isConnExists) {
        throw new Error("Connection Already Exists...");
      }

      const connectionReqObj = new connectionRequestModel({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });
      await connectionReqObj.save();
      res.send(
        `${user.userName} Sent Connection Request to ${toUser.userName} status ${status}....`
      );
    } catch (err) {
      res.status(400).send("Error " + " " + err.message);
    }
    //
  }
);

requestRouter.post(
  "/connectionRequest/review/:requestId/:status",
  userAuth,
  async (req, res) => {
    const loggedUser = req.user[0];
    //console.log(loggedUser);
    const { status, requestId } = req.params;
    try {
      const allowedStatus = ["Accepted", "Rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json("Status is not valid" + status);
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: "Interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request Not Found" });
      }
      connectionRequest.status = status;
      const connectionReqData = await connectionRequest.save();
      //const data = connectionReqData.map(row=>row.fromUserId)
      res.json({ message: "Connection Request" + status, connectionReqData });
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  }
);

module.exports = requestRouter;
