const { User } = require('../models');

exports.createUser = async (req, res) => {
    try {
        const { name, phone_number, upi_id, avatar_url } = req.body;
        const user = await User.create({ name, phone_number, upi_id, avatar_url });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
