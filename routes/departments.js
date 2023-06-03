const router = require('express').Router();
const Department = require('../models/Department');
// ==================== CREATE ====================
router.post('/', async (req, res) => {
    // IF Department Already Exists in DB then return Error else Save Department
    const departmentExists = await Department.findOne({ name: req.body.name });
    if (departmentExists) return res.status(400).send('Department Already Exists');
    const newDepartment = new Department(req.body);
    try {
        const savedDepartment = await newDepartment.save();
        res.status(200).json(savedDepartment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==================== UPDATE ====================
router.put('/:id', async (req, res) => {
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedDepartment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==================== DELETE ====================
router.delete('/:id', async (req, res) => {
    try {
        await
            Department.findByIdAndDelete(req.params.id);
        res.status(200).json('Department has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==================== GET ====================
router.get('/find/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==================== GET ALL ====================
router.get('/', async (req, res) => {
    const query = req.query.new;
    try {
        let departments;
        if (query) {
            // Get 5 Random
            departments = await Department.aggregate([
                { $sample: { size: 6 } },
            ]);
        } else {
            departments = await Department.find().sort({name: 1});
        }
        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ==================== GET DEPARTMENT BACKGROUND IMAGE ====================
router.get('/backgroundpicture/:code', async (req, res) => {
    try {
        const department = await Department.findOne({ code: req.params.code });
        res.status(200).json(department.backgroundpicture);
    } catch (err) {
        res.status(500).json(err);
    }
});


// ==================== SEARCH ====================
router.get('/search/:name', async (req, res) => {
    try {
        const departments = await Department.find({ name: { $regex: req.params.name, $options: 'i' } });
        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;