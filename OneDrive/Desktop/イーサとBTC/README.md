# ETH & BTC Price Tracker Chrome Extension

ETHとBTCのリアルタイム価格を表示するChrome拡張機能です。

## 機能

- ETH（Ethereum）とBTC（Bitcoin）の現在価格を表示
- 24時間の価格変動率を表示
- 30秒ごとの自動更新
- 手動更新ボタン
- 美しいグラデーションUI

## インストール方法

1. Chromeブラウザで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このフォルダを選択する

## 使用方法

1. 拡張機能アイコンをクリックしてポップアップを開く
2. ETHとBTCの現在価格と24時間変動率が表示されます
3. 「更新」ボタンで手動更新が可能
4. 30秒ごとに自動的に価格が更新されます

## 技術仕様

- **API**: CoinGecko API
- **更新間隔**: 30秒
- **対応通貨**: ETH, BTC
- **価格表示**: USD

## ファイル構成

- `manifest.json` - Chrome拡張機能の設定ファイル
- `popup.html` - ポップアップのHTML
- `popup.css` - スタイルシート
- `popup.js` - JavaScript ロジック

## API制限

CoinGecko APIの無料プランを使用しているため、レート制限があります。