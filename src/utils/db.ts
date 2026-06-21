export interface User {
  user_id: string;
  name: string;
  email: string;
  role: 'resident' | 'manager';
  password?: string; // Optional for security when stored/sent to app state
}

export interface FoodItem {
  food_id: string;
  title: string;
  category: string;
  quantity_available: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

export interface CartRequest {
  cart_id: string;
  user_id: string;
  user_name?: string; // Denormalized for display convenience
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string; // Name of manager or empty string
  frozen: boolean;
  date: string;
  items: CartItemDetail[];
}

export interface CartItemDetail {
  food_id: string;
  title: string;
  category: string;
  quantity: number;
}

export interface CartItem {
  cart_id: string;
  food_id: string;
  quantity: number;
}

export interface Feedback {
  feedback_id: string;
  user_id: string;
  user_name: string;
  target_type: 'food' | 'system' | 'cart';
  target_id: string; // food_id, cart_id or 'system'
  target_title: string; // name of food, cart name, or 'system'
  rating: number; // 1-5
  comment: string;
  resolved: boolean;
  date: string;
}

export interface Complaint {
  complaint_id: string;
  user_id: string;
  user_name: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  description: string;
  date: string;
}

// -------------------------------------------------------------
// Asynchronous HTTP Helpers
// -------------------------------------------------------------

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `Request failed with status ${res.status}`);
  }
  return res.json();
};

export const seedDatabase = (): void => {
  // Database seeding is now handled by the backend server on startup.
  console.log('Client-side seedDatabase is a no-op now (handled by backend).');
};

// -------------------------------------------------------------
// User Table Operations
// -------------------------------------------------------------

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch('/api/users');
  return handleResponse(res);
};

export const registerUser = async (user: Omit<User, 'user_id'> & { password?: string }): Promise<User> => {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return handleResponse(res);
};

// -------------------------------------------------------------
// FoodItem Table Operations
// -------------------------------------------------------------

export const getFoodItems = async (): Promise<FoodItem[]> => {
  const res = await fetch('/api/food-items');
  return handleResponse(res);
};

export const saveFoodItem = async (item: Omit<FoodItem, 'food_id'>): Promise<FoodItem> => {
  const res = await fetch('/api/food-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return handleResponse(res);
};

export const updateFoodItem = async (updatedItem: FoodItem): Promise<void> => {
  const res = await fetch(`/api/food-items/${updatedItem.food_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem)
  });
  await handleResponse(res);
};

export const deleteFoodItem = async (food_id: string): Promise<void> => {
  const res = await fetch(`/api/food-items/${food_id}`, {
    method: 'DELETE'
  });
  await handleResponse(res);
};

// -------------------------------------------------------------
// CartRequest Operations
// -------------------------------------------------------------

export const getCartRequests = async (): Promise<CartRequest[]> => {
  const res = await fetch('/api/cart-requests');
  return handleResponse(res);
};

export const createCartRequest = async (user_id: string, user_name: string, items: CartItemDetail[]): Promise<CartRequest> => {
  const res = await fetch('/api/cart-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, user_name, items })
  });
  return handleResponse(res);
};

export const updateCartRequestStatus = async (cart_id: string, status: 'approved' | 'rejected', managerName: string): Promise<void> => {
  const res = await fetch(`/api/cart-requests/${cart_id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, approved_by: managerName })
  });
  await handleResponse(res);
};

export const toggleCartRequestFrozen = async (cart_id: string, frozen: boolean): Promise<void> => {
  const res = await fetch(`/api/cart-requests/${cart_id}/frozen`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frozen })
  });
  await handleResponse(res);
};

// -------------------------------------------------------------
// Feedback Table Operations
// -------------------------------------------------------------

export const getFeedbacks = async (): Promise<Feedback[]> => {
  const res = await fetch('/api/feedbacks');
  return handleResponse(res);
};

export const createFeedback = async (feedback: Omit<Feedback, 'feedback_id' | 'date' | 'resolved'>): Promise<Feedback> => {
  const res = await fetch('/api/feedbacks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });
  return handleResponse(res);
};

export const resolveFeedback = async (feedback_id: string): Promise<void> => {
  const res = await fetch(`/api/feedbacks/${feedback_id}/resolve`, {
    method: 'PUT'
  });
  await handleResponse(res);
};

// -------------------------------------------------------------
// Complaint Table Operations
// -------------------------------------------------------------

export const getComplaints = async (): Promise<Complaint[]> => {
  const res = await fetch('/api/complaints');
  return handleResponse(res);
};

export const createComplaint = async (complaint: Omit<Complaint, 'complaint_id' | 'date' | 'status'>): Promise<Complaint> => {
  const res = await fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complaint)
  });
  return handleResponse(res);
};

export const updateComplaintStatus = async (complaint_id: string, status: 'open' | 'in_progress' | 'resolved'): Promise<void> => {
  const res = await fetch(`/api/complaints/${complaint_id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  await handleResponse(res);
};

export const updateComplaintPriority = async (complaint_id: string, priority: 'low' | 'medium' | 'high'): Promise<void> => {
  const res = await fetch(`/api/complaints/${complaint_id}/priority`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priority })
  });
  await handleResponse(res);
};

// -------------------------------------------------------------
// Daily Waste Logs Table Operations
// -------------------------------------------------------------

export interface LogEntry {
  id: string;
  item: string;
  prepared: number;
  consumed: number;
  wasted: number;
  date: string;
}

export const getLogs = async (): Promise<LogEntry[]> => {
  const res = await fetch('/api/logs');
  return handleResponse(res);
};

export const saveLogEntry = async (log: Omit<LogEntry, 'id' | 'wasted'>): Promise<LogEntry> => {
  const res = await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  });
  return handleResponse(res);
};

export const deleteLogEntry = async (id: string): Promise<void> => {
  const res = await fetch(`/api/logs/${id}`, {
    method: 'DELETE'
  });
  await handleResponse(res);
};

