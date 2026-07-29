import { Request, Response } from 'express';
import { Task } from '../models/Task.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, dueDateTime, priority, status, tags } = req.body;
    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      dueDateTime,
      priority,
      status,
      tags
    });
    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Task creation failed' });
  }
};

export const listTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, priority, sort } = req.query;
    const filter: Record<string, unknown> = { userId: req.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let query = Task.find(filter).sort({ createdAt: -1 });

    if (sort === 'dueDate') {
      query = Task.find(filter).sort({ dueDateTime: 1, createdAt: -1 });
    }

    const tasks = await query;
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load tasks' });
  }
};

export const getTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load task' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Task update failed' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Task deletion failed' });
  }
};
