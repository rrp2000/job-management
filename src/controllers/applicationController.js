const { default: mongoose } = require("mongoose");
const applicationModel = require("../models/applicationModel");
const jobModel = require("../models/jobModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator");

const markdown = require("markdown").markdown

const apply = async (req, res) => {
  try {
    let jobId = req.params.jobId;
    console.log(jobId);

    //validation for jobId
    if (!validator.validateString(jobId))
      return res
        .status(400)
        .send({ status: false, message: "jobId is required" });
    if (!mongoose.Types.ObjectId.isValid(jobId))
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid jobId" });
    let job = await jobModel.findById(jobId);
    if (!job)
      return res
        .status(400)
        .send({ status: false, message: "No such job exists" });

    //validations for userId
    let userId = req.user.id;

    if (job.userId == userId)
      return res
        .status(400)
        .send({ status: false, message: "You can't apply to your own job" });

    if (!validator.validateString(userId))
      return res
        .status(400)
        .send({ status: false, message: "userId is required" });

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid userId" });

    let user = await userModel.findById(userId).select({fName:1, lName:1, email:1});

    if (!user)
      return res
        .status(400)
        .send({ status: false, message: "No such user exists" });

    //!validations for coverletter

    //create the application data
    let applicationData = {};
    applicationData.jobId = jobId;
    applicationData.userId = userId;

    // validations for existing application
    if (await applicationModel.findOne({ jobId, userId }))
      return res
        .status(400)
        .send({
          status: false,
          message: "You have already applied to this job",
        });
    let application = await applicationModel.create(applicationData);

    // update the job data with the applicaiton data
    await jobModel.findOneAndUpdate(
      { _id: jobId },
      { $push: { applicants: user } },
      { upsert: true }
    );
    // res.render(markdown.toHTML("Hello *World*!"))

    return res
      .status(200)
      .send({
        status: true,
        message: "Application applied successfully",
        data: application,
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { apply };
