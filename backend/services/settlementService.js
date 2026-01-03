const { Expense, Split, User } = require('../models');

/**
 * Minimizes the number of transactions required to settle debts.
 * @param {Object} balances - An object where keys are User IDs and values are net amounts 
 * (Positive = Owed money, Negative = Owes money)
 * Example: { "User1": 500, "User2": -300, "User3": -200 }
 */
function simplifyDebts(balances) {
    const settlements = [];

    // Separate people into two lists: Creditors and Debtors
    let creditors = [];
    let debtors = [];

    for (let user in balances) {
        if (balances[user] > 0) {
            creditors.push({ id: user, amount: parseFloat(balances[user]) });
        } else if (balances[user] < 0) {
            debtors.push({ id: user, amount: Math.abs(parseFloat(balances[user])) });
        }
    }

    // Sort by amount (optional heuristic for cleaner splits, but greedy works without too)
    // creditors.sort((a, b) => b.amount - a.amount);
    // debtors.sort((a, b) => b.amount - a.amount);

    let i = 0; // Debtor pointer
    let j = 0; // Creditor pointer

    while (i < debtors.length && j < creditors.length) {
        let amountToTransfer = Math.min(debtors[i].amount, creditors[j].amount);

        // Only add if amount is significant
        if (amountToTransfer > 0.01) {
            settlements.push({
                from: debtors[i].id,
                to: creditors[j].id,
                amount: amountToTransfer.toFixed(2),
            });
        }

        debtors[i].amount -= amountToTransfer;
        creditors[j].amount -= amountToTransfer;

        // Move pointers if settled
        if (Math.abs(debtors[i].amount) < 0.01) i++;
        if (Math.abs(creditors[j].amount) < 0.01) j++;
    }

    return settlements;
}

const getGroupBalances = async (groupId) => {
    // 1. Fetch Key Expenses and Splits
    const expenses = await Expense.findAll({
        where: { group_id: groupId },
        include: [{ model: Split }]
    });

    const netBalances = {};

    // 2. Calculate initial net balances
    for (const expense of expenses) {
        const payerId = expense.paid_by;
        const amount = parseFloat(expense.amount);

        // Payer gets +amount (they are owed this back initially)
        netBalances[payerId] = (netBalances[payerId] || 0) + amount;

        // Subtract splits
        for (const split of expense.Splits) {
            const debtorId = split.user_id;
            const owed = parseFloat(split.amount_owed);

            // Debtor gets -owed
            netBalances[debtorId] = (netBalances[debtorId] || 0) - owed;
        }
    }

    // Note: The logic above simplifies: Payer Paid 100. Payer +100.
    // Split: Payer owes 50, Friend owes 50.
    // Payer: +100 - 50 = +50. Friend: -50.
    // Net: Payer +50 (is owed 50), Friend -50 (owes 50). Correct.

    return netBalances;
};

const getSettlementsForGroup = async (groupId) => {
    const balances = await getGroupBalances(groupId);
    return simplifyDebts(balances);
};

module.exports = {
    simplifyDebts,
    getGroupBalances,
    getSettlementsForGroup
};
