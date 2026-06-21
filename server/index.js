import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { User } from './models/User.js';
import { FoodItem } from './models/FoodItem.js';
import { CartRequest } from './models/CartRequest.js';
import { Feedback } from './models/Feedback.js';
import { Complaint } from './models/Complaint.js';
import { LogEntry } from './models/LogEntry.js';

dotenv.config();

let isDbConnected = false;

const app = express();
app.use(cors());
app.use(express.json());

// Intercept DB calls with a 503 if MongoDB is down, rather than crashing
app.use((req, res, next) => {
  if (!isDbConnected && req.path.startsWith('/api')) {
    return res.status(503).json({
      error: 'Database connection is offline. Please configure a valid MONGO_URI in server/.env.'
    });
  }
  next();
});

// Seeding function
const seedDatabase = async () => {
  try {
    // 1. Seed Food Items
    const foodCount = await FoodItem.countDocuments();
    if (foodCount === 0) {
      const defaultFood = [
        { food_id: 'food-1', title: 'Veg Biryani', category: 'Main Course', quantity_available: 100, status: 'available' },
        { food_id: 'food-2', title: 'Roti & Mix Veg', category: 'Main Course', quantity_available: 80, status: 'available' },
        { food_id: 'food-3', title: 'Paneer Butter Masala', category: 'Side Dish', quantity_available: 45, status: 'available' },
        { food_id: 'food-4', title: 'Dal Makhani', category: 'Side Dish', quantity_available: 60, status: 'available' },
        { food_id: 'food-5', title: 'Aloo Paratha', category: 'Breakfast', quantity_available: 12, status: 'low_stock' },
        { food_id: 'food-6', title: 'Fruit Custard', category: 'Dessert', quantity_available: 0, status: 'out_of_stock' }
      ];
      await FoodItem.insertMany(defaultFood);
      console.log('Seeded default food items.');
    }

    // 2. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultUsers = [
        { user_id: 'u-1', name: 'Vikas Manager', email: 'manager@hostel.com', role: 'manager', password: 'password' },
        { user_id: 'u-2', name: 'John Resident', email: 'resident@hostel.com', role: 'resident', password: 'password' }
      ];
      await User.insertMany(defaultUsers);
      console.log('Seeded default users.');
    }

    // 3. Seed Complaints
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      const defaultComplaints = [
        {
          complaint_id: 'comp-1',
          user_id: 'u-2',
          user_name: 'John Resident',
          subject: 'Slow Service during dinner hours',
          priority: 'medium',
          status: 'open',
          description: 'Between 8:30 PM and 9:00 PM, the lines are extremely long and food items are slow to be refilled.',
          date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0]
        },
        {
          complaint_id: 'comp-2',
          user_id: 'u-2',
          user_name: 'John Resident',
          subject: 'Fruit custard was out of stock too early',
          priority: 'low',
          status: 'resolved',
          description: 'Last Thursday, the fruit custard dessert ran out within the first 30 minutes of lunchtime.',
          date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0]
        }
      ];
      await Complaint.insertMany(defaultComplaints);
      console.log('Seeded default complaints.');
    }

    // 4. Seed Feedbacks
    const feedbackCount = await Feedback.countDocuments();
    if (feedbackCount === 0) {
      const defaultFeedbacks = [
        {
          feedback_id: 'feed-1',
          user_id: 'u-2',
          user_name: 'John Resident',
          target_type: 'food',
          target_id: 'food-3',
          target_title: 'Paneer Butter Masala',
          rating: 5,
          comment: 'Absolutely delicious Paneer Butter Masala! Spices and texture were spot on.',
          resolved: false,
          date: new Date(Date.now() - 12 * 3600 * 1000).toISOString().split('T')[0]
        },
        {
          feedback_id: 'feed-2',
          user_id: 'u-2',
          user_name: 'John Resident',
          target_type: 'system',
          target_id: 'system',
          target_title: 'Global System',
          rating: 4,
          comment: 'The dashboard works smoothly and animations are beautiful. Micro-interactions look fantastic.',
          resolved: true,
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0]
        }
      ];
      await Feedback.insertMany(defaultFeedbacks);
      console.log('Seeded default feedbacks.');
    }

    // 5. Seed Log Entries
    const logsCount = await LogEntry.countDocuments();
    if (logsCount === 0) {
      const defaultLogs = [
        { id: "log-1", item: "Veg Biryani", prepared: 120, consumed: 105, wasted: 15, date: "2026-06-18" },
        { id: "log-2", item: "Paneer Butter Masala", prepared: 80, consumed: 76, wasted: 4, date: "2026-06-19" },
        { id: "log-3", item: "Dal Makhani", prepared: 95, consumed: 80, wasted: 15, date: "2026-06-20" }
      ];
      await LogEntry.insertMany(defaultLogs);
      console.log('Seeded default daily logs.');
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const user_id = `user-${Date.now()}`;
    const newUser = new User({ user_id, name, email, role, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// FoodItems
app.get('/api/food-items', async (req, res) => {
  try {
    const items = await FoodItem.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/food-items', async (req, res) => {
  try {
    const { title, category, quantity_available, status } = req.body;
    const food_id = `food-${Date.now()}`;
    const newItem = new FoodItem({ food_id, title, category, quantity_available, status });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/food-items/:food_id', async (req, res) => {
  try {
    const { food_id } = req.params;
    const { title, category, quantity_available, status } = req.body;
    const updated = await FoodItem.findOneAndUpdate(
      { food_id },
      { title, category, quantity_available, status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Food item not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/food-items/:food_id', async (req, res) => {
  try {
    const { food_id } = req.params;
    const deleted = await FoodItem.findOneAndDelete({ food_id });
    if (!deleted) return res.status(404).json({ error: 'Food item not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CartRequests
app.get('/api/cart-requests', async (req, res) => {
  try {
    const requests = await CartRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart-requests', async (req, res) => {
  try {
    const { user_id, user_name, items } = req.body;
    const cart_id = `cart-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newRequest = new CartRequest({
      cart_id,
      user_id,
      user_name,
      status: 'pending',
      approved_by: '',
      frozen: false,
      date,
      items
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/cart-requests/:cart_id/status', async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { status, approved_by } = req.body;
    const updated = await CartRequest.findOneAndUpdate(
      { cart_id },
      { status, approved_by },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Cart request not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/cart-requests/:cart_id/frozen', async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { frozen } = req.body;
    const updated = await CartRequest.findOneAndUpdate(
      { cart_id },
      { frozen },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Cart request not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Feedbacks
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const { user_id, user_name, target_type, target_id, target_title, rating, comment } = req.body;
    const feedback_id = `feed-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newFeedback = new Feedback({
      feedback_id,
      user_id,
      user_name,
      target_type,
      target_id,
      target_title,
      rating,
      comment,
      resolved: false,
      date
    });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/feedbacks/:feedback_id/resolve', async (req, res) => {
  try {
    const { feedback_id } = req.params;
    const updated = await Feedback.findOneAndUpdate(
      { feedback_id },
      { resolved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Feedback not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const { user_id, user_name, subject, priority, description } = req.body;
    const complaint_id = `comp-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newComplaint = new Complaint({
      complaint_id,
      user_id,
      user_name,
      subject,
      priority,
      status: 'open',
      description,
      date
    });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/complaints/:complaint_id/status', async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { status } = req.body;
    const updated = await Complaint.findOneAndUpdate(
      { complaint_id },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Complaint not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/complaints/:complaint_id/priority', async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { priority } = req.body;
    const updated = await Complaint.findOneAndUpdate(
      { complaint_id },
      { priority },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Complaint not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await LogEntry.find({}).sort({ date: -1, createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const { item, prepared, consumed, date } = req.body;
    const id = `log-${Date.now()}`;
    const wasted = Math.max(0, prepared - consumed);
    const finalDate = date || new Date().toISOString().split('T')[0];
    const newLog = new LogEntry({
      id,
      item,
      prepared,
      consumed,
      wasted,
      date: finalDate
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.delete('/api/logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LogEntry.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ error: 'Log entry not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food-app';

const start = async () => {
  isDbConnected = await connectDB(MONGO_URI);
  if (isDbConnected) {
    await seedDatabase();
  } else {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Running without database connection. Connect database via server/.env to enable operational views.');
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
