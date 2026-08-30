import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { countItems } from '../db/repos/items';
import { countQuotes, countQuotesByStatus, recentQuotes } from '../db/repos/quotes';
import { countUnreadMessages } from '../db/repos/messages';

export const statsRouter = Router();

// GET /api/stats (admin) → métricas del dashboard
statsRouter.get('/', requireAuth, (_req, res) => {
  res.json({
    items: countItems(),
    quotes: countQuotes(),
    messagesUnread: countUnreadMessages(),
    quotesByStatus: countQuotesByStatus(),
    recentQuotes: recentQuotes(5),
  });
});
