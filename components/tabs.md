# Tabs

> コンテンツ切り替えタブコンポーネント仕様。
> Tailwind CSS 4

---

## 1. 原則

- **コンテンツ切り替え**: 同一ページ内で関連するコンテンツ群を切り替え表示する
- **下線インジケーター**: アクティブタブは下線 + 色 + ウェイトの3つで現在位置を示す
- **キーボード操作**: 矢印キーでタブ間移動。disabled タブはスキップ
- **1つだけアクティブ**: 常に1つのタブのみが選択状態

---

## 2. 解剖

```
  [一般]   [通知]   [セキュリティ]
  ━━━━━
  一般設定の内容がここに表示されます。
```

| パーツ | 役割 | 必須 |
|--------|------|------|
| Tab List | タブのコンテナ。`role="tablist"` を持つ | Yes |
| Tab | 個々のタブボタン。`role="tab"` を持つ | Yes |
| Tab Panel | タブに対応するコンテンツ領域。`role="tabpanel"` を持つ | Yes |
| Underline | アクティブタブの下線インジケーター | Yes |

---

## 3. パターン

### 3-1. 状態

| 状態 | スタイル |
|------|---------|
| Active | `text-primary-600 font-semibold border-b-2 border-primary-600 cursor-default` |
| Inactive | `text-slate-500 font-medium border-b-2 border-transparent hover:text-slate-700 cursor-pointer` |
| Disabled | `text-slate-300 border-b-2 border-transparent cursor-not-allowed` |

### 3-2. フォーカス

- **マウスクリック**: フォーカスリング非表示（`outline-none`）
- **キーボード操作**: `focus-visible:ring-2 focus-visible:ring-primary-500/50`

---

## 4. 振る舞い

### Tab

```
px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-colors
```

| プロパティ | Active | Inactive | Disabled |
|-----------|--------|----------|----------|
| テキスト色 | `text-primary-600` | `text-slate-500` | `text-slate-300` |
| フォントウェイト | `font-semibold` | `font-medium` | `font-medium` |
| ボーダー | `border-b-2 border-primary-600` | `border-b-2 border-transparent` | `border-b-2 border-transparent` |
| ホバー | — | `hover:text-slate-700` | — |
| カーソル | `default` | `pointer` | `cursor-not-allowed` |

### Tab List

```
flex border-b border-slate-200
```

### Tab Panel

```
py-4
```

---

## 5. アクセシビリティ

| 属性 | 値 |
|------|------|
| `role="tablist"` | タブリストのコンテナ |
| `role="tab"` | 各タブボタン |
| `role="tabpanel"` | 各コンテンツパネル |
| `aria-selected` | `"true"` / `"false"` |
| `aria-controls` | 対応するパネルの id |
| `aria-labelledby` | パネルに対応するタブの id |
| `tabindex` | Active: `"0"` / Inactive: `"-1"` |

### キーボード操作

| キー | 動作 |
|------|------|
| `←` / `→` | 前/次のタブに移動（disabled をスキップ） |
| `Home` | 最初のタブに移動 |
| `End` | 最後のタブに移動 |

### キーボードナビゲーション JavaScript

```javascript
function handleTabKeydown(tablistId, event) {
  var tablist = document.getElementById(tablistId);
  var tabs = Array.from(tablist.querySelectorAll('[role="tab"]:not([disabled])'));
  var index = tabs.indexOf(event.target);
  var next = -1;
  switch (event.key) {
    case 'ArrowRight': next = (index + 1) % tabs.length; break;
    case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
    case 'Home': next = 0; break;
    case 'End': next = tabs.length - 1; break;
    default: return;
  }
  event.preventDefault();
  switchTab(tablistId, tabs[next].id);
  tabs[next].focus();
}
```

サンプル HTML の各タブボタンに `onkeydown` を追加する:

```html
<button role="tab" ... onclick="switchTab('tablist-1', 'tab-1')" onkeydown="handleTabKeydown('tablist-1', event)">
  一般
</button>
```

> 共通: prohibited.md「カラー」「アクセシビリティ」参照

---

## 6. Tailwind サンプル

### 基本タブ

```html
<div>
  <div role="tablist" aria-label="設定タブ" class="flex border-b border-slate-200" id="tablist-1">
    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0"
      class="px-4 py-2.5 text-sm font-semibold text-primary-600 border-b-2 border-primary-600 cursor-default outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-colors"
      onclick="switchTab('tablist-1', 'tab-1')">
      一般
    </button>
    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1"
      class="px-4 py-2.5 text-sm font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-700 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 transition-colors"
      onclick="switchTab('tablist-1', 'tab-2')">
      通知
    </button>
  </div>
  <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" tabindex="0" class="py-4">
    <p class="text-sm text-body">一般設定の内容</p>
  </div>
  <div id="panel-2" role="tabpanel" aria-labelledby="tab-2" tabindex="0" class="py-4 hidden">
    <p class="text-sm text-body">通知設定の内容</p>
  </div>
</div>
```

### Disabled タブ

```html
<button role="tab" aria-selected="false" tabindex="-1" disabled aria-disabled="true"
  class="px-4 py-2.5 text-sm font-medium text-slate-300 border-b-2 border-transparent cursor-not-allowed">
  エンタープライズ
</button>
```

### JavaScript

```javascript
function switchTab(tablistId, activeTabId) {
  var tablist = document.getElementById(tablistId);
  var tabs = tablist.querySelectorAll('[role="tab"]');
  tabs.forEach(function(tab) {
    var panelId = tab.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (tab.id === activeTabId) {
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      tab.classList.remove('text-slate-500', 'border-transparent', 'font-medium', 'cursor-pointer');
      tab.classList.add('text-primary-600', 'border-primary-600', 'font-semibold', 'cursor-default');
      if (panel) panel.classList.remove('hidden');
    } else {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
      tab.classList.remove('text-primary-600', 'border-primary-600', 'font-semibold', 'cursor-default');
      if (!tab.disabled) {
        tab.classList.add('text-slate-500', 'border-transparent', 'font-medium', 'cursor-pointer');
      }
      if (panel) panel.classList.add('hidden');
    }
  });
}
```
