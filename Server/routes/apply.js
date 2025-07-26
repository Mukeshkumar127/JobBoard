const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const router = express.Router();

const Job = require('../models/Job');

const upload = multer({ dest: 'uploads/' });

router.post('/apply/:jobId', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Resume file is required' });
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user.id
    });

    if (existing) {
      return res.status(409).json({ msg: 'You have already applied to this job.' });
    }

    const application = new Application({
      job: req.params.jobId,
      candidate: req.user.id,
      resume: req.file.path,
      message: req.body.message || '',
    });

    await application.save();

    res.json({ msg: 'Application submitted' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const user = req.user;
    const resumeFilename = req.file.originalname;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📥 New Application for Job ID: ${req.params.jobId}`,
      text: `
    A new job application was received.
    
    👤 Candidate: ${user.name}
    🆔 ID: ${user.id}
    📧 Email: ${user.email || 'Email not available in token'} `,
    
    attachments: [
        {
          filename: resumeFilename,
          path: req.file.path
        }
      ]
    
    });

  } catch (err) {
    console.error('❌ Application Error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    console.error('❌ Error fetching candidate applications:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
