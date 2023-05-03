# このプロジェクトについて

このリポジトリにはChatGPT-3と対話をしながら1本の物語を作っていく
Webアプリケーション「09:32 火星に向かう」の実験的なコード群を格納しています。

ChatGPT-3は地球から火星に向かうまでの5日間の物語を1日ごとに書いていきます。
1日と1日の間にプレイヤーは次の日の行動を入力し、その内容は次の日の物語に反映されます。

## 必要なもの

+ プログラミングについての知識
+ OpenAIのAPIのキー（自身で取得してください）

## 確認環境

- node 18.11.0
- yarn 1.22.19

## 注意点

簡単にアプリを試せるようにするために、フロントエンドのみで完結するように作っています。
（このアプリはローカル環境用です）

もしデプロイを考えている場合は、APIサーバーなどを別途開発して、構成自体を変えてください。
（APIのキー情報が露出しないようにしてください）



## 始め方

package.jsonと同じ階層に

.env.local

という名前のファイルを作成し、OpenAIのAPI KEYとOpenAIのOrganization IDを設定する。

```txt
NEXT_PUBLIC_HOST=http://localhost:3000

// Do not use these values in a production environment as these keys will be exposed on the front-end.
NEXT_PUBLIC_OPENAI_API_KEY={Your API KEY}
NEXT_PUBLIC_OPENAI_ORGANIZATION={Your Organization ID}
```

packageをインストールし、開発環境を起動する。

```bash
yarn

yarn dev
```

[http://localhost:3000](http://localhost:3000) をブラウザーで開く

