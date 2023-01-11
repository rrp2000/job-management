const express = require('express')
const userController = require('../controllers/userController')
const jobController = require('../controllers/jobController')
const applicationController = require('../controllers/applicationController')

const {authMiddleware} = require('../middleware/auth')


const router = express.Router()

router.get('/', (req, res) => {
  res.json({message:"hello world"})
})

//user Routes
router.post('/register', userController.register)
router.post('/login', userController.login)

//job router
router.post('/job',authMiddleware, jobController.createJob)
router.get('/job',authMiddleware, jobController.getJobs)
router.get('/job/:jobId',authMiddleware, jobController.getJobById)

//application router
router.post("/apply/:jobId",authMiddleware, applicationController.apply)



module.exports = router
