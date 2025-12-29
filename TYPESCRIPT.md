# TypeScript導入ガイド

このプロジェクトにTypeScriptが導入されました。

## インストール済みパッケージ

- `typescript`: TypeScriptコンパイラ
- `ts-loader`: WebpackでTypeScriptをビルドするためのローダー
- `@types/node`: Node.jsの型定義
- `@types/webpack`: Webpackの型定義
- `@typescript-eslint/parser`: TypeScript用のESLintパーサー
- `@typescript-eslint/eslint-plugin`: TypeScript用のESLintプラグイン
- `@hotwired/stimulus-webpack-helpers`: Stimulus用のWebpackヘルパー

## ディレクトリ構造

```
app/javascript/
├── application.ts              # メインエントリーポイント
├── controllers/
│   ├── application.ts          # Stimulusアプリケーション設定
│   ├── index.ts                # コントローラーの登録
│   └── hello_controller.ts     # サンプルコントローラー
└── types/
    ├── global.d.ts             # グローバル型定義
    └── stimulus.d.ts           # Stimulus拡張型定義
```

## 使用方法

### 型チェック

```bash
# 型チェックを実行
yarn type-check

# 型チェックをwatch モードで実行
yarn type-check:watch
```

### 新しいコントローラーの作成

TypeScriptでStimulusコントローラーを作成する例：

```typescript
import { Controller } from "@hotwired/stimulus"

export default class MyController extends Controller {
  static targets = ["output"]
  
  declare readonly outputTarget: HTMLElement
  
  connect(): void {
    console.log("Controller connected!")
  }
  
  greet(event: Event): void {
    event.preventDefault()
    this.outputTarget.textContent = "Hello from TypeScript!"
  }
}
```

### コントローラーの登録

`app/javascript/controllers/index.ts`でコントローラーを登録：

```typescript
import { application } from "./application"
import MyController from "./my_controller"

application.register("my", MyController)
```

## tsconfig.json

TypeScriptの設定は`tsconfig.json`で管理されています。主な設定：

- `target`: ES2020
- `module`: ESNext
- `strict`: true（厳格な型チェック）
- `allowJs`: true（JSファイルも許可）
- パスエイリアス: `@/*` → `app/javascript/*`

## Webpack設定

`config/webpack/environment.js`でTypeScriptのビルド設定が追加されています：

- `.ts`と`.tsx`ファイルのサポート
- `ts-loader`による変換
- 拡張子の自動解決

## ベストプラクティス

1. **明示的な型定義**: 可能な限り型を明示的に定義する
2. **strictモード**: `tsconfig.json`の`strict`オプションを有効にする
3. **型チェック**: コミット前に`yarn type-check`を実行
4. **インターフェース**: 複雑なオブジェクトには型またはインターフェースを定義

## トラブルシューティング

### 型エラーが表示される場合

```bash
yarn type-check
```

で詳細なエラーメッセージを確認できます。

### ビルドエラーが発生する場合

1. `node_modules`を削除して再インストール:
```bash
rm -rf node_modules
yarn install
```

2. TypeScriptのキャッシュをクリア:
```bash
rm -rf dist
```

## 参考リンク

- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Stimulus公式ドキュメント](https://stimulus.hotwired.dev/)
- [Webpacker](https://github.com/rails/webpacker)

