const router = require('express').Router();
const Announcement = require('../models/Announcement');
const verify = require('./verifyToken');

// 1. CREATE
// 2. UPDATE
// 3. DELETE
// 4. GET

// ==================== CREATE ====================
router.post('/', verify, async (req, res) => {
    const newAnnouncement = new Announcement(req.body);
    try {
        const savedAnnouncement = await newAnnouncement.save();
        res.status(200).json(savedAnnouncement);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== UPDATE ====================
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedAnnouncement);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== DELETE ====================
router.delete('/:id', verify, async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.status(200).json('Announcement has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }
} );

// ==================== GET ====================
router.get('/find/:id', verify, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        res.status(200).json(announcement);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL ====================
router.get('/', verify, async (req, res) => {
    const query = req.query.new;
    try {
        const announcements = query ? await Announcement.find().sort({ _id: -1 }).limit(5) : await Announcement.find();
        res.status(200).json(announcements);
    } catch (err) {
        res.status(500).json(err);
    }
}
);


// Get By Type
router.get('/find/type/:type', verify, async (req, res) => {
    try {
        // const announcements = await Announcement.find({ type: req.params.type });
        // Get announcement.date and format it in a nice way
        const announcements = await Announcement.find({ type: req.params.type }).sort({ date: -1 });
        res.status(200).json(announcements);
    } catch (err) {
        res.status(500).json(err);  
    }
}
);

module.exports = router;
