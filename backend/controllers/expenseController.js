const { Expense, Split, sequelize } = require('../models');

exports.createExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { group_id, paid_by, amount, description, date, splits } = req.body;

        const expense = await Expense.create({
            group_id, paid_by, amount, description, date: date || new Date()
        }, { transaction: t });

        if (splits && splits.length > 0) {
            const splitData = splits.map(s => ({
                expense_id: expense.id,
                user_id: s.user_id,
                amount_owed: s.amount_owed,
                share_type: s.share_type || 'exact' // 'exact', 'percentage', 'equal'
            }));
            await Split.bulkCreate(splitData, { transaction: t });
        }

        await t.commit();
        res.status(201).json(expense);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        // Assume filtered by group_id in query
        const { group_id } = req.query;
        if (!group_id) return res.status(400).json({ error: "group_id required" });

        const expenses = await Expense.findAll({
            where: { group_id },
            include: ['Payer', Split]
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.parseExpenseAI = async (req, res) => {
    // Placeholder for GenAI hook
    const { text } = req.body;
    // TODO: Integrate Gemini/GPT here
    // For now, return stub data
    res.json({
        message: "AI Parsing Placeholder",
        parsed: {
            amount: 500, // example
            description: "Extracted: " + text,
            participants: []
        }
    });
};
