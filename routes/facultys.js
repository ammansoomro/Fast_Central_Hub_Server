const router = require('express').Router();
const Faculty = require('../models/Faculty');
const verify = require('./verifyToken');
const Review = require('../models/ReviewFaculty');
const Material = require('../models/Material');
const Course = require('../models/Course');

// ==================== CREATE ====================
router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newFaculty = new Faculty(req.body);
        try {
            const savedFaculty = await newFaculty.save();
            res.status(200).json(savedFaculty);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to create faculties');
    }
}
);

// ==================== UPDATE ====================
router.put('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedFaculty);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to update faculties');
    }
}

);

// ==================== DELETE ====================
router.delete('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Faculty.findByIdAndDelete(req.params.id);
            res.status(200).json('Faculty has been deleted');
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to delete faculties');
    }
}

);

// ==================== GET ====================
router.get('/find/:id', verify, async (req, res) => {
    
    try {
        const faculty = await Faculty.findById(req.params.id);
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL ====================
router.get('/', verify, async (req, res) => {
    const query = req.query.new;
    try {
        let faculties;
        if (query) {
            // Get 8 Random 
            faculties = await Faculty.aggregate([
                { $sample: { size: 6 } },
            ]);
        } else {
            faculties = await Faculty.find().sort({name: 1});
        }
        res.status(200).json(faculties);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET RANDOM ====================
router.get('/random', verify, async (req, res) => {
    const type = req.query.type;
    let faculty;
    try {
        if (type === 'faculty') {
            faculty = await Faculty.aggregate([
                { $sample: { size: 1 } },
            ]);
        } else {
            faculty = await Faculty.aggregate([
                { $match: { type: type } },
                { $sample: { size: 1 } },
            ]);
        }
        res.status(200).json(faculty);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== SEARCH ====================
router.get('/search/:searchString', verify, async (req, res) => {
    try {
        const faculties = await Faculty.find({ name: { $regex: req.params.searchString, $options: 'i' } });
        res.status(200).json(faculties);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== PAGINATION ====================
router.get('/page/:page', verify, async (req, res) => {
    const page = req.params.page;
    const limit = 20;
    try {
        const faculties = await Faculty.find().skip((page - 1) * limit).limit(limit);
        res.status(200).json(faculties);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== COUNT ====================
router.get('/count', verify, async (req, res) => {
    try {
        const count = await Faculty.countDocuments();
        res.status(200).json(count);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== COUNT BY DEPARTMENT ====================
router.get('/count/:department', verify, async (req, res) => {
    try {
        const count = await Faculty.countDocuments({ department: req.params.department });
        res.status(200).json(count);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== PAGINATION BY DEPARTMENT ====================
router.get('/page/:page/:department', verify, async (req, res) => {
    const page = req.params.page;
    const limit = 20;
    try {
        const faculties = await Faculty.find({ department: req.params.department }).skip((page - 1) * limit).limit(limit);
        res.status(200).json(faculties);
    } catch (err) {
        res.status(500).json(err);
    }
}
);


// ==================== GET UPVOTES AND DOWNVOTES COUNT ====================
router.get('/updownvotescount', verify, async (req, res) => {
    try {
        const reviews = await Review.find();
        const upvotes = reviews.map(review => review.upvote);
        const downvotes = reviews.map(review => review.downvote);
        const faculty_ids = reviews.map(review => review.faculty_id);
        const updownvotes = [];
        for (let i = 0; i < faculty_ids.length; i++) {
            updownvotes.push({
                upvote: upvotes[i],
                downvote: downvotes[i],
                faculty_id: faculty_ids[i],
            });
        }
        const updownvotescount = [];
        for (let i = 0; i < faculty_ids.length; i++) {
            const faculty_id = faculty_ids[i];
            const upvote = upvotes[i];
            const downvote = downvotes[i];
            const index = updownvotescount.findIndex(updownvotescount => updownvotescount.faculty_id === faculty_id);
            if (index === -1) {
                updownvotescount.push({
                    upvote,
                    downvote,
                    faculty_id,
                });
            } else {
                updownvotescount[index].upvote += upvote;
                updownvotescount[index].downvote += downvote;
            }
        }
        res.status(200).json(updownvotescount);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

//  ==================== GET FACULTY BY DEPARTMENT ====================
router.get('/department/:department', verify, async (req, res) => {
    try {
        const faculties = await Faculty.find({ department: req.params.department });
        res.status(200).json(faculties);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// Get all courses of a faculty, if the given faculty id matches with the faculty id in the material collection
router.get('/courses/:id', verify, async (req, res) => {
    try {
        const courses = await Material.find({ teacher_id: req.params.id });
        // Get unique course_id from the courses array and then get all courses data from the course collection
        const course_ids = [...new Set(courses.map(course => course.course_id))];
        const faculty_Courses = await Course.find({ _id: { $in: course_ids } });

        res.status(200).json(faculty_Courses);
    } catch (err) {
        res.status(500).json(err);
    }
}
);


module.exports = router;