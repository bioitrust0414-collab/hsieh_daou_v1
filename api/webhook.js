/**
 * 謝天地的修道丹心 · LINE OA Webhook Server
 *
 * 功能：
 *   1. 接收 LINE 平台的 Webhook 事件
 *   2. 新好友加入時自動發送歡迎 Flex Message
 *   3. 提供 /push-article API 供 Supabase Function 呼叫，推播新文章給所有好友
 *
 * 部署建議：Vercel Serverless Function 或 Supabase Edge Function
 */

const express = require('express');
const crypto  = require('crypto');
const axios   = require('axios');

const app = express();
app.use(express.json());

// ── 環境變數 ──────────────────────────────────────────────
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET       = process.env.LINE_CHANNEL_SECRET;
const SITE_URL                  = process.env.SITE_URL || 'https://daou.veridiangold.com';
const LIFF_ID                   = process.env.VITE_LIFF_ID || '2010848952-VfGV0qlc';
const LIFF_URL                  = `https://liff.line.me/${LIFF_ID}`;

// ── LINE API Helper ───────────────────────────────────────
const lineApi = axios.create({
  baseURL: 'https://api.line.me/v2/bot',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
  },
});

// ── 簽章驗證 Middleware ───────────────────────────────────
function verifyLineSignature(req, res, next) {
  const signature = req.headers['x-line-signature'];
  if (!signature) return res.status(401).send('Missing signature');

  const body = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha256', LINE_CHANNEL_SECRET)
    .update(body)
    .digest('base64');

  if (hash !== signature) return res.status(401).send('Invalid signature');
  next();
}

// ── Flex Message：歡迎卡片 ────────────────────────────────
function buildWelcomeMessage() {
  return {
    type: 'flex',
    altText: '歡迎加入謝天地的修道丹心！',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#8b6f47',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: '謝天地的修道丹心',
            color: '#faf6ed',
            size: 'xl',
            weight: 'bold',
            align: 'center',
          },
          {
            type: 'text',
            text: '修道 · 典藏 · 傳承',
            color: '#e8d5b7',
            size: 'sm',
            align: 'center',
            margin: 'sm',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#faf6ed',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: '感謝您加入！',
            size: 'lg',
            weight: 'bold',
            color: '#2c2416',
          },
          {
            type: 'text',
            text: '這裡是國學典籍的修行殿堂。每當有新講演筆記發布，您將第一時間收到通知。',
            wrap: true,
            size: 'sm',
            color: '#5a4a3a',
            margin: 'sm',
          },
          {
            type: 'separator',
            margin: 'lg',
            color: '#c9a96e',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              buildFeatureRow('📜', '典藏目錄', '山海經 · 道家心法'),
              buildFeatureRow('🔔', '即時推播', '新講演第一時間通知'),
              buildFeatureRow('🛒', '典藏商城', '書籍 · 周邊商品'),
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#f0e8d8',
        paddingAll: '16px',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#8b6f47',
            action: {
              type: 'uri',
              label: '立即前往典藏 →',
              uri: LIFF_URL,
            },
          },
        ],
      },
    },
  };
}

function buildFeatureRow(icon, title, desc) {
  return {
    type: 'box',
    layout: 'horizontal',
    spacing: 'sm',
    contents: [
      { type: 'text', text: icon, size: 'md', flex: 0 },
      {
        type: 'box',
        layout: 'vertical',
        flex: 1,
        contents: [
          { type: 'text', text: title, size: 'sm', weight: 'bold', color: '#2c2416' },
          { type: 'text', text: desc, size: 'xs', color: '#8b7355' },
        ],
      },
    ],
  };
}

// ── Flex Message：新文章推播卡片 ─────────────────────────
function buildArticlePushMessage(article) {
  const tagBadges = (article.tags || []).slice(0, 3).map(tag => ({
    type: 'box',
    layout: 'vertical',
    backgroundColor: '#f0e8d8',
    cornerRadius: '4px',
    paddingAll: '4px',
    contents: [
      { type: 'text', text: tag, size: 'xxs', color: '#8b6f47' },
    ],
  }));

  return {
    type: 'flex',
    altText: `🔔 最新講演：${article.title_zh}`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'horizontal',
        backgroundColor: '#c0392b',
        paddingAll: '10px',
        contents: [
          { type: 'text', text: '🔔 最新講演 · 剛剛發布', color: '#ffffff', size: 'sm', weight: 'bold' },
        ],
      },
      hero: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#faf6ed',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: `【${article.collection_label || '典藏'} ${article.episode}】`,
            size: 'sm',
            color: '#8b6f47',
            weight: 'bold',
          },
          {
            type: 'text',
            text: article.title_zh,
            size: 'xl',
            weight: 'bold',
            color: '#2c2416',
            wrap: true,
            margin: 'sm',
          },
          {
            type: 'text',
            text: article.subtitle_zh || '',
            size: 'sm',
            color: '#5a4a3a',
            wrap: true,
            margin: 'sm',
          },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'md',
            spacing: 'sm',
            contents: tagBadges,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#f0e8d8',
        paddingAll: '16px',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#8b6f47',
            action: {
              type: 'uri',
              label: '閱讀全文 →',
              uri: `${LIFF_URL}/${article.collection}/${article.slug}`,
            },
          },
          {
            type: 'text',
            text: '點擊即可在 LINE 內開啟網頁',
            size: 'xxs',
            color: '#8b7355',
            align: 'center',
          },
        ],
      },
    },
  };
}

// ── Webhook 路由 ──────────────────────────────────────────
app.post('/webhook', verifyLineSignature, async (req, res) => {
  res.status(200).send('OK'); // 立即回應 LINE，避免 timeout

  const events = req.body.events || [];
  for (const event of events) {
    try {
      if (event.type === 'follow') {
        // 新好友加入：發送歡迎訊息
        await lineApi.post('/message/reply', {
          replyToken: event.replyToken,
          messages: [buildWelcomeMessage()],
        });
        console.log(`[follow] Sent welcome to ${event.source.userId}`);
      }

      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text.trim();
        if (text === '典藏' || text === '目錄') {
          await lineApi.post('/message/reply', {
            replyToken: event.replyToken,
            messages: [{
              type: 'text',
              text: `📜 典藏目錄\n\n請點擊下方連結進入完整典藏：\n${LIFF_URL}`,
            }],
          });
        }
      }
    } catch (err) {
      console.error('[webhook error]', err.response?.data || err.message);
    }
  }
});

// ── 推播新文章 API（供 Supabase Database Webhook 呼叫）────
app.post('/push-article', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.PUSH_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const article = req.body;
  if (!article || !article.title_zh) {
    return res.status(400).json({ error: 'Invalid article data' });
  }

  try {
    // 取得所有好友 ID（需要 Premium OA 帳號）
    const followersRes = await lineApi.get('/followers/ids');
    const userIds = followersRes.data.userIds || [];

    // 分批推播（LINE API 每次最多 500 人）
    const batchSize = 500;
    const message = buildArticlePushMessage(article);
    let successCount = 0;

    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      await lineApi.post('/message/multicast', {
        to: batch,
        messages: [message],
      });
      successCount += batch.length;
    }

    console.log(`[push-article] Pushed "${article.title_zh}" to ${successCount} users`);
    res.json({ success: true, pushed: successCount });
  } catch (err) {
    console.error('[push-article error]', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── 健康檢查 ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', bot: '謝天地的修道丹心', basicId: '@297yfqpc' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`LINE Webhook Server running on port ${PORT}`);
});

module.exports = app;
