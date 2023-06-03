const router = require('express').Router();
const ReviewCourse = require('../models/ReviewCourse');
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
        const reviewCourseExists = await ReviewCourse.findOne
        ({
            course_id: req.body.course_id,
            user_id: req.body.user_id
        });
        if (reviewCourseExists) return res.status(400).send('ReviewCourse Already Exists');
        const newReviewCourse = new ReviewCourse(req.body);
        try {
            const savedReviewCourse = await newReviewCourse.save();
            res.status(200).json(savedReviewCourse);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
);

// ==================== UPDATE ====================
router.put('/:id', verify, async (req, res) => {
        try {
            const updatedReviewCourse = await ReviewCourse.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true});
            res.status(200).json(updatedReviewCourse);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
);

// ==================== DELETE ====================
router.delete('/:id', verify, async (req, res) => {
        try {
            await ReviewCourse.findByIdAndDelete(req.params.id);
            res.status(200).json('ReviewCourse has been deleted');
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
);

// ==================== GET ====================
router.get('/find/:course_id', verify, async (req, res) => {
    try {
        const reviewCourses = await ReviewCourse
        .find({course_id: req.params.course_id})
        .populate('user_id', 'name');
        res.status(200).json(reviewCourses);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL ====================
router.get('/', verify, async (req, res) => {
    try {
        const reviewCourses = await ReviewCourse.find();
        res.status(200).json(reviewCourses);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET UPVOTE COUNT ====================
router.get('/upvote/:course_id', verify, async (req, res) => {
    // Get All courses then count the upvotes of a course
    try {
        const reviewCourses = await ReviewCourse.find({course_id: req.params.course_id});
        let upvoteCount = 0;
        reviewCourses.forEach(reviewCourse => {
            upvoteCount += reviewCourse.upvote;
        });
        res.status(200).json(upvoteCount);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET DOWNVOTE COUNT ====================
router.get('/downvote/:course_id', verify, async (req, res) => {
    // Get All courses then count the downvotes of a course
    try {
        const reviewCourses = await ReviewCourse.find({course_id: req.params.course_id});
        let downvoteCount = 0;
        reviewCourses.forEach(reviewCourse => {
            downvoteCount += reviewCourse.downvote;
        });
        res.status(200).json(downvoteCount);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET RATING ====================
router.get('/rating/:course_id', verify, async (req, res) => {
    try {
        const reviewCourses = await ReviewCourse.find({course_id: req.params.course_id});
        let ratingSum = 0;
        reviewCourses.forEach(reviewCourse => {
            ratingSum += reviewCourse.rating;
        });
        const rating = ratingSum / reviewCourses.length;
        res.status(200).json(rating.toFixed(2));
    }
    catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;

