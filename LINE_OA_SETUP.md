# LINE OA 完整建置指南
## 謝天地的修道丹心 · @297yfqpc

---

## 一、已完成的程式碼架構

```
hsieh_daou_v1/
├── src/
│   ├── hooks/use-liff.tsx          ✅ LIFF 登入 / 登出 / 取得 Profile
│   ├── components/liff-provider.tsx ✅ 全站 Context Provider
│   └── lib/supabase.ts             ✅ record_line_login RPC 呼叫
├── line-webhook/
│   └── index.js                    ✅ Webhook 伺服器（歡迎訊息 + 推播）
├── supabase/migrations/
│   └── 001_line_users.sql          ✅ 資料庫建置腳本
├── vercel.json                     ✅ Vercel 部署設定
└── .env.example                    ✅ 環境變數範例
```

---

## 二、您需要完成的步驟

### 步驟 1：在 Supabase 執行 SQL

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案 → 左側選單 **SQL Editor**
3. 複製 `supabase/migrations/001_line_users.sql` 的全部內容貼上並執行
4. 確認出現 `line_users` 與 `articles` 兩張資料表

### 步驟 2：取得 Supabase 金鑰

1. Supabase Dashboard → 您的專案 → **Settings → API**
2. 複製：
   - **Project URL** → 填入 `VITE_SUPABASE_URL`
   - **anon public key** → 填入 `VITE_SUPABASE_PUBLISHABLE_KEY`

### 步驟 3：確認 LIFF 設定

您的 LIFF ID 已確認：`2010848952-VfGV0qlc`

請至 [LINE Developers Console](https://developers.line.biz) 確認：
- LIFF App 的 **Endpoint URL** 已設定為您的 Vercel 網址
- **Scope** 已勾選：`profile`、`openid`

### 步驟 4：在 LINE Developers 取得 Channel Secret

1. [LINE Developers Console](https://developers.line.biz) → 您的 Channel
2. **Basic settings** → 複製 **Channel secret**
3. 填入 `.env.local` 的 `LINE_CHANNEL_SECRET`

### 步驟 5：設定 Webhook URL

1. LINE Developers Console → **Messaging API** 分頁
2. **Webhook URL** 填入：`https://您的vercel網址.vercel.app/webhook`
3. 點擊 **Verify** 確認連線成功
4. 開啟 **Use webhook** 開關

### 步驟 6：建立 .env.local 並部署

```bash
# 複製範例檔
cp .env.example .env.local

# 編輯填入實際值
nano .env.local

# 推送到 GitHub（.env.local 已在 .gitignore 中，不會被上傳）
git add .
git commit -m "feat: add LINE OA webhook and Supabase migration"
git push origin main
```

### 步驟 7：在 Vercel 設定環境變數

1. [Vercel Dashboard](https://vercel.com) → 您的專案 → **Settings → Environment Variables**
2. 逐一新增 `.env.example` 中的所有變數（填入實際值）
3. 重新部署

---

## 三、新文章推播流程

當您在 Supabase 新增一篇文章並將 `is_published` 設為 `true` 時，可以呼叫推播 API：

```bash
curl -X POST https://您的vercel網址.vercel.app/push-article \
  -H "Authorization: Bearer 您的PUSH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title_zh": "【道家心法 EP03】太上老君降臨鶴鳴山",
    "subtitle_zh": "天人交接的神聖時刻，道教聖山的文化密碼",
    "collection": "daojia",
    "collection_label": "道家心法",
    "episode": "EP03",
    "slug": "daojia-ep03",
    "tags": ["道家心法", "節氣", "聖山"]
  }'
```

---

## 四、LINE 圖文選單 (Rich Menu) 設定

圖文選單設計稿已生成（`line_rich_menu.png`），請至 LINE OA Manager 後台：
1. **主頁** → **聊天室相關** → **圖文選單**
2. 上傳設計稿圖片（尺寸：2500 × 1686 px）
3. 設定 6 個區域的連結動作：
   - 典藏目錄 → `https://liff.line.me/2010848952-VfGV0qlc`
   - 最新講演 → `https://liff.line.me/2010848952-VfGV0qlc/latest`
   - 加入會員 → `https://liff.line.me/2010848952-VfGV0qlc/member`
   - 典藏商城 → `https://liff.line.me/2010848952-VfGV0qlc/shop`
   - 聯絡我們 → `https://line.me/R/ti/p/@297yfqpc`
   - 前往官網 → `https://您的vercel網址.vercel.app`

---

## 五、系統連動架構

```
您（管理者）
    │
    ▼ 新增/編輯文章
Supabase 資料庫
    │
    ├─── Realtime ──────▶ Web 官網（頁面自動更新）
    │
    └─── 呼叫 /push-article ──▶ LINE Webhook Server ──▶ 推播給所有 OA 好友
```
