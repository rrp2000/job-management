const { default: mongoose } = require("mongoose");
const jobModel = require("../models/jobModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator");

//create job

const createJob = async (req, res) => {
  try {
    const jobDetails = req.body;

    let { title, description, email, skills, experience, userId } = jobDetails;

    //validations for title
    if (!validator.validateString(title))
      return res
        .status(400)
        .send({ status: false, message: "Title is inValid" });

    //validations for description
    if (!validator.validateString(description))
      return res
        .status(400)
        .send({ status: false, message: "Description is inValid" });

    //validations for email
    if (!validator.validateString(email))
      return res
        .status(400)
        .send({ status: false, message: "Email is inValid" });
    if (!validator.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email format" });
    if (!(await userModel.findOne({ email })))
      return res.status(400).send({
        status: false,
        message: "No such user exist with the email provided",
      });

    //validations for skills
    if (Array.isArray(skills)) {
      if (skills.length == 0)
        return res
          .status(400)
          .send({ status: false, message: "Skills is inValid" });
      skills.map((skill) => skill.trim());
      jobDetails.skills = skills;
    }
    if (typeof skills === "string") {
      let skillsArr = [];
      skills.split(",").forEach((skill) => skillsArr.push(skill.trim()));
      jobDetails.skills = skillsArr;
    }

    // validations for experience
    if (!validator.validateString(experience))
      return res
        .status(400)
        .send({ status: false, message: " experience is inValid" });
    if (["beginner", "intermediate", "advanced"].indexOf(experience) == -1)
      return res.status(400).send({
        status: false,
        message: " experience can only be beginner or intermediate or advanced",
      });

    //validations for userId
    if (!validator.validateString(userId))
      return res
        .status(400)
        .send({ status: false, message: " userId is inValid" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid user id" });
    if (userId !== req.user.id)
      return res.status(400).send({
        status: false,
        message: "you are not authorized to perform this action",
      });

    const newJob = await jobModel.create(jobDetails);
    res
      .status(201)
      .send({ status: true, message: "created successfully", data: newJob });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

//get jobs
const getJobs = async (req, res) => {
  try {
    let query = req.query;
    query.page = query.page || 1;
    query.limit = query.limit || 1;

    if (Object.keys(query).length === 2) {
      let jobs = await jobModel
        .find()
        .select({
          title: 1,
          description: 1,
          email: 1,
          skills: 1,
          experience: 1,
        })
        .skip(query.page * query.limit)
        .limit(query.limit);

      return res
        .status(200)
        .send({ status: true, message: "jobs found", data: jobs });
    }
    let filter = {};
    if (query.skills) {
      if (query.skills.trim().length === 0) {
        delete query.skills;
      } else {
        filter.skills = query.skills.split(",");
        filter.skills = { $all: filter.skills };
      }
    }
    if (query.experience) {
      if (query.experience.trim().length === 0) {
        delete filter.experience;
      } else {
        filter.experience = query.experience.trim();
      }
    }
    let jobs = await jobModel
      .find(filter)
      .select({
        title: 1,
        description: 1,
        email: 1,
        skills: 1,
        experience: 1,
      })
      .skip(query.page * query.limit)
      .limit(query.limit);
    res.status(200).send({ status: true, message: "jobs found", data: jobs });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

//get specific job
const getJobById = async (req, res) => {
  try {
    let jobId = req.params.jobId;

    if (!mongoose.Types.ObjectId.isValid(jobId))
      return res
        .status(400)
        .send({ status: "error", message: "invalid job id provided" });

    let job = await jobModel.findById(jobId).select({
      title: 1,
      description: 1,
      email: 1,
      skills: 1,
      experience: 1,
      applicants: 1,
    });

    if (!job)
      return res
        .status(404)
        .send({ status: "error", message: "No such job exist with the jobId" });
    return res
      .status(200)
      .send({ status: true, message: "job found", data: job });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
};
