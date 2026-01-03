const { Group, GroupMember, User } = require('../models');
const settlementService = require('../services/settlementService');

exports.createGroup = async (req, res) => {
    try {
        const { group_name, category, created_by, currency } = req.body;
        const group = await Group.create({ group_name, category, created_by, currency });

        // Add creator as admin
        await GroupMember.create({ group_id: group.id, user_id: created_by, is_admin: true });

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGroup = async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id, {
            include: [{ model: User, through: { attributes: [] } }]
        });
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { user_id } = req.body;
        await GroupMember.create({ group_id: req.params.id, user_id, is_admin: false });
        res.status(201).json({ message: 'Member added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSettlements = async (req, res) => {
    try {
        const groupId = req.params.id;
        const settlements = await settlementService.getSettlementsForGroup(groupId);
        res.json(settlements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
