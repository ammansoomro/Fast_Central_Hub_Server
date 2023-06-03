const router = require('express').Router();
const ReviewFaculty = require('../models/ReviewFaculty');
const verify = require('./verifyToken');

// 1. CREATE
// 2. UPDATE
// 3. DELETE
// 4. GET
// 5. GET ALL
// 6. UPVOTE COUNT
// 7. DOWNVOTE COUNT

// ==================== CREATE ====================
router.post('/', verify, async (req, res) => {
    const reviewFacultyExists = await ReviewFaculty.findOne
        ({
            faculty_id: req.body.faculty_id,
            user_id: req.body.user_id
        });
    if (reviewFacultyExists) return res.status(400).send('ReviewFaculty Already Exists');
    const newReviewFaculty = new ReviewFaculty(req.body);
    try {
        const savedReviewFaculty = await newReviewFaculty.save();
        res.status(200).json(savedReviewFaculty);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== UPDATE ====================
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedReviewFaculty = await Review
        Faculty.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedReviewFaculty);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== DELETE ====================
router.delete('/:id', verify, async (req, res) => {
    try {
        await ReviewFaculty.findByIdAndDelete(req.params.id);
        res.status(200).json('ReviewFaculty has been deleted');
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ====================
router.get('/find/:faculty_id', verify, async (req, res) => {
    try {
        const reviewFaculty = await ReviewFaculty.find({ faculty_id: req.params.faculty_id });
        res.status(200).json(reviewFaculty);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL ====================
router.get('/', verify, async (req, res) => {
    try {
        const reviewFaculties = await ReviewFaculty.find();
        res.status(200).json(reviewFaculties);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== UPVOTE COUNT ====================
router.get('/upvote/:faculty_id', verify, async (req, res) => {
    try {
        const reviewFaculty = await ReviewFaculty.find({ faculty_id: req.params.faculty_id});
        let upvoteCount = 0;
        reviewFaculty.forEach((review) => {
            upvoteCount += review.upvote;
        });
        res.status(200).json(upvoteCount);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== DOWNVOTE COUNT ====================
router.get('/downvote/:faculty_id', verify, async (req, res) => {
    try {
        const reviewFaculty = await ReviewFaculty.find({ faculty_id: req.params.faculty_id });
        let downvoteCount = 0;
        reviewFaculty.forEach((review) => {
            downvoteCount += review.downvote;
        });
        res.status(200).json(downvoteCount);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// Export the router
module.exports = router;

