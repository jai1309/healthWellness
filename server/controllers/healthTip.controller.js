import HealthTip from "../models/healthTip.model.js";
import ActivityLog from "../models/activityLog.model.js";
import {
  errorResponseBody,
  successResponseBody,
} from "../utils/responsebody.js";

const getRandomHealthTip = async (req, res) => {
  try {
    const randomTipId = Math.floor(Math.random() * 20) + 1;

    const tip = await HealthTip.findOne({ tip_id: randomTipId });

    if (!tip) {
      return res.status(404).json({
        ...errorResponseBody,
        message: "Health tip not found",
      });
    }

    // Log activity
    await ActivityLog.create({
      user_id: req.user._id,
      action: "GET_HEALTH_TIP",
      resource: "HealthTip",
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "Random health tip fetched",
      data: tip,
    });
  } catch (error) {
    return res.status(500).json({
      ...errorResponseBody,
      err: error.message,
    });
  }
};

export { getRandomHealthTip };