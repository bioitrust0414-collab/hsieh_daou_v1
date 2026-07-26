# LIFF 整合指南

本文檔說明 `hsieh_daou_v1` 專案如何整合 LINE LIFF SDK，以支持在 LINE 應用內開啟網頁。

## 📋 修改清單

### 1. **package.json** ✓
- 新增依賴：`@line/liff@^2.29.1`
- 安裝命令：`npm install @line/liff --legacy-peer-deps`

### 2. **.env.local** ✓
新增環境變數配置：
```env
VITE_LIFF_ID=YOUR_LIFF_ID_HERE
VITE_LINE_CHANNEL_ID=YOUR_CHANNEL_ID_HERE
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:5173
```

### 3. **src/hooks/use-liff.tsx** ✓ (新建)
建立 React Hook 以管理 LIFF 初始化和狀態：
- `isInitialized`：LIFF 是否已初始化
- `isInLineApp`：是否在 LINE App 內開啟
- `profile`：用戶資料（如果已登入）
- `error`：初始化錯誤
- `login()`、`logout()`、`openWindow()`：LIFF 操作方法

**特點**：
- SSR 安全：使用 `typeof window !== 'undefined'` 檢查
- 非同步初始化：動態導入 LIFF SDK
- 完整的錯誤處理

### 4. **src/components/liff-provider.tsx** ✓ (新建)
建立 React Context Provider 以提供全域 LIFF 狀態：
- `LiffProvider`：包裝應用以提供 LIFF 上下文
- `useLiffContext()`：在任何組件中存取 LIFF 狀態

### 5. **src/routes/__root.tsx** ✓ (修改)
修改全域根組件以整合 LIFF：

**變更內容**：
- 在 `<head>` 中加入 LIFF SDK 腳本標籤
- 在 `RootComponent` 中使用 `useLiff()` Hook
- 新增開發環境下的 LIFF 狀態調試面板（右下角）
- 記錄 LIFF 初始化狀態到控制台

### 6. **src/server.ts** ✓ (修改)
修改伺服器端入口以支持 LIFF：

**變更內容**：
- 新增註解說明 LIFF SDK 只應在客戶端加載
- 新增開發環境下的請求日誌
- 改進錯誤日誌記錄

---

## 🚀 使用方式

### 基本初始化
LIFF 會在應用啟動時自動初始化。在任何組件中可以使用 `useLiff()` Hook：

```tsx
import { useLiff } from '@/hooks/use-liff';

export function MyComponent() {
  const { isInLineApp, profile, login } = useLiff();

  return (
    <div>
      {isInLineApp ? (
        <p>歡迎 {profile?.displayName}！</p>
      ) : (
        <button onClick={login}>登入 LINE</button>
      )}
    </div>
  );
}
```

### 使用 Context Provider
如果需要全域存取 LIFF 狀態，可以在 `__root.tsx` 中包裝 `LiffProvider`：

```tsx
import { LiffProvider } from '@/components/liff-provider';

function RootComponent() {
  return (
    <LiffProvider>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </LiffProvider>
  );
}
```

然後在任何組件中使用：

```tsx
import { useLiffContext } from '@/components/liff-provider';

export function MyComponent() {
  const { isInLineApp, profile } = useLiffContext();
  // ...
}
```

---

## ⚙️ 配置步驟

### 1. 建立 LINE LIFF App
1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立新的 Provider 和 Channel
3. 在 Channel 中建立 LIFF App
4. 複製 **LIFF ID**

### 2. 設定環境變數
在 `.env.local` 中填入 LIFF ID：
```env
VITE_LIFF_ID=1234567890-abcdefgh
```

### 3. 設定 HTTPS（必需）
LIFF 要求 Endpoint 必須是 HTTPS。開發時可以使用：

**方案 A：使用 ngrok**
```bash
ngrok http 5173
```

**方案 B：使用 Vite 的 basicSsl 插件**
```bash
npm install --save-dev @vitejs/plugin-basic-ssl
```

在 `vite.config.ts` 中：
```ts
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [basicSsl()],
  // ...
});
```

### 4. 在 LINE Developers 中設定 Endpoint
在 LIFF App 設定中，設定 Endpoint URL：
- 開發環境：`https://your-ngrok-url.ngrok.io`
- 生產環境：`https://your-production-domain.com`

---

## 🧪 開發環境測試

### 查看 LIFF 狀態
開發環境下，應用右下角會顯示 LIFF 狀態調試面板：
- `LIFF: ✓ In LINE` 或 `LIFF: ✗ Not in LINE`
- 用戶名稱（如果已登入）
- 任何初始化錯誤

### 在 LINE App 中測試
1. 在 LINE 官方帳號中建立 Rich Menu 或發送訊息
2. 在訊息中加入指向您應用的連結
3. 在 LINE App 中點擊連結以測試 LIFF 功能

### 在瀏覽器中測試
直接在瀏覽器中開啟應用，LIFF 會偵測到不在 LINE App 內，調試面板會顯示 `✗ Not in LINE`。

---

## 📝 常見問題

### Q: 為什麼 LIFF 初始化失敗？
**A**: 檢查以下項目：
1. `VITE_LIFF_ID` 是否正確設定
2. Endpoint URL 是否在 LINE Developers 中正確配置
3. 是否使用 HTTPS（開發環境可使用 ngrok）
4. 瀏覽器控制台是否有錯誤訊息

### Q: 如何在伺服器端存取用戶資料？
**A**: LIFF 只能在客戶端使用。如果需要在伺服器端驗證用戶，需要：
1. 在客戶端獲取 ID Token：`liff.getIDToken()`
2. 將 Token 發送到伺服器
3. 在伺服器驗證 Token

### Q: 如何實作 LINE 登入？
**A**: 使用 `useLiff()` Hook 中的 `login()` 方法：
```tsx
const { login, isInLineApp } = useLiff();

if (isInLineApp && !isLoggedIn) {
  login();
}
```

---

## 🔗 相關資源

- [LINE LIFF 官方文檔](https://developers.line.biz/en/docs/liff/)
- [LIFF SDK 參考](https://developers.line.biz/en/docs/liff/reference/)
- [LINE Developers Console](https://developers.line.biz/console/)

---

*最後更新：2026-07-26*
