const router = require('express').Router();
const Material = require('../models/Material');
const verify = require('./verifyToken');

// 1. CREATE
// 2. UPDATE
// 3. DELETE
// 4. GET
// 5. GET ALL
// 6. GET ALL BY COURSE
// 7. GET ALL BY TEACHER
// 8. GET ALL BY COURSE AND TEACHER
// 9. Get ALL BY COURSE AND TEACHER AND TYPE


// ==================== CREATE ====================
router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        // If Material Already Exists in DB then return Error else Save Material, Check name, course_id, teacher_id
        const materialExists = await Material.findOne({ name: req.body.name, course_id: req.body.course_id, teacher_id: req.body.teacher_id });
        if (materialExists) return res.status(400).send('Material Already Exists');
        const newMaterial = new Material(req.body);
        try {
            const savedMaterial = await newMaterial.save();
            res.status(200).json(savedMaterial);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to create materials');
    }
}
);

// ==================== UPDATE ====================
router.put('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedMaterial);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to update materials');
    }
}
);

// ==================== DELETE ====================
router.delete('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Material.findByIdAndDelete(req.params.id);
            res.status(200).json('Material has been deleted');
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to delete materials');
    }
}
);

// ==================== GET ====================
router.get('/find/:id', verify, async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        res.status(200).json(material);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL ====================
router.get('/', verify, async (req, res) => {
    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL BY COURSE ====================
router.get('/bycourse/:course_id', verify, async (req, res) => {
    try {
        const materials = await Material.find({ course_id: req.params.course_id });
        res.status(200).json(materials);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL BY TEACHER ====================
router.get('/byteacher/:teacher_id', verify, async (req, res) => {
    try {
        const materials = await Material.find({ teacher_id: req.params.teacher_id });
        res.status(200).json(materials);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL BY COURSE AND TEACHER ====================
router.get('/bycourseteacher/:course_id/:teacher_id', verify, async (req, res) => {
    try {
        const materials = await Material.find({ course_id: req.params.course_id, teacher_id: req.params.teacher_id });
        res.status(200).json(materials);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== Get ALL BY COURSE AND TEACHER AND TYPE ====================
router.get('/bycourseteachertype/:course_id/:teacher_id/:type', verify, async (req, res) => {
    if (req.user) {
        try {
            const materials = await Material.find({ course_id: req.params.course_id, teacher_id: req.params.teacher_id, type: req.params.type });
            res.status(200).json(materials);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to view materials');
    }
}
);

module.exports = router;

