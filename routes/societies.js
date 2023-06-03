const router = require('express').Router();
const verify = require('./verifyToken');
const Society = require('../models/Society');

// 1. CREATE
// 2. UPDATE
// 3. DELETE
// 4. GET
// 5. GET ALL

// ==================== CREATE ====================
router.post('/', verify, async (req, res) => {
    // IF Society Already Exists in DB then return Error else Save Society
    const societyExists = await Society.findOne({ name: req.body.name });
    if (societyExists) return res.status(400).send('Society Already Exists');
    const newSociety = new Society(req.body);
    try {
        const savedSociety = await newSociety.save();
        res.status(200).json(savedSociety);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// ==================== UPDATE ====================
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedSociety = await Society.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedSociety);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== DELETE ====================
router.delete('/:id', verify, async (req, res) => {
    try {
        await Society.findByIdAndDelete(req.params.id);
        res.status(200).json('Society has been deleted');
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ====================
router.get('/find/:id', verify, async (req, res) => {
    try {
        const society = await Society.findById(req.params.id);
        res.status(200).json(society);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// ==================== GET ALL ====================
router.get('/', verify, async (req, res) => {
    const query = req.query.new;
    if (query) {
        try {
            // 5 Ranndom
            const societies = await Society.aggregate([
                { $sample: { size: 6 } },
            ]);
            res.status(200).json(societies);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        try {
            const societies = await Society.find().sort({name: 1});
            res.status(200).json(societies);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
}
);

// ==================== SEARCH ====================
router.get('/search/:name', verify, async (req, res) => {
    try {
        const societies = await Society.find({ name: { $regex: req.params.name, $options: 'i' } });
        res.status(200).json(societies);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);

// Get 1 random society
router.get('/random', verify, async (req, res) => {
    // Get Any Random Society Data
    const type = req.query.type;
    let society;
    try {
        if (type === 'new') {
            society = await Society.aggregate([
                { $sample: { size: 1 } },
            ]);
        }
        else if (type === 'old') {
            society = await Society.aggregate([
                { $sample: { size: 1 } },
            ]);
        }
        else {
            society = await Society.aggregate([
                { $sample: { size: 1 } },
            ]);
        }
        res.status(200).json(society);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
);



module.exports = router;