import express from 'express';
import Order from '@/models/orders';
import Meal from '@/models/meals';

const router = express.Router();

router.get('/meals', async (req, res) => {
/**
 * Get all meals
 */
    try {
        const meals = await Meal.find();
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Mahlzeiten', error });
    }
});

router.get('/meals/:id', async (req, res) => {
/**
 * Get a specific meal by ID
 */
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({ message: 'Mahlzeit nicht gefunden' });
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Mahlzeit', error });
    }
});

router.post('/orders', async (req, res) => {
/**
 * Create a new order
 */
    try {
        const newOrder = new Order({
            "user-id": req.body.userId,
            date: req.body.date,
            orderedMeals: req.body.orderedMeals.map(meal => ({
                mealId: meal.mealId,
                quantity: meal.quantity,
                date: meal.date,
                day: meal.day
            }))
        });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Erstellen der Bestellung', error });
    }
});

router.get('/orders', async (req, res) => {
/**
 * Get orders for a specific date
 */
    const { date } = req.query;
    try {
        const orders = await Order.find({ date: new Date(date) }).populate('orderedMeals.mealId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Bestellungen', error });
    }
});

router.post('/changeOrder', async (req, res) => {
/**
 * Update an existing order
 */
    const { orderedMeals } = req.body;
    try {
        for (const meal of orderedMeals) {
            await Order.updateOne(
                { 'orderedMeals._id': meal._id },
                { $set: { 'orderedMeals.$.quantity': meal.quantity } }
            );
        }
        res.status(200).json({ message: 'Bestellung erfolgreich aktualisiert' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Aktualisieren der Bestellung', error });
    }
});

router.delete('/orders/:id', async (req, res) => {
/**
 * Delete an order by ID
 */
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Bestellung nicht gefunden' });
        res.status(200).json({ message: 'Bestellung erfolgreich gelöscht' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Löschen der Bestellung', error });
    }
});

export default router;
