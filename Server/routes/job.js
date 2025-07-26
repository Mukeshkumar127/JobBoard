const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const allowedAdminEmail = 'mkumar@gmail.com';

    if (req.user.email !== allowedAdminEmail) {
      return res.status(403).json({ message: 'Only admin is allowed to post jobs' });
    }

    const job = new Job({
      ...req.body,
      postedBy: req.user.id
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/', async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

router.get('/:id', async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.json(job);
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (String(job.postedBy) !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;