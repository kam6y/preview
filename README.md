# 環境構築手順
## 事前準備

1. api/web フォルダの中にある .env.exampleをコピーして、同じ場所に.envファイルを作成してください(下記参考)
```shell
// api/webフォルダ直下の一部を抜粋
.
├── .env ←このファイルを作成する
├── .env.example
```

2. api/web > .envの内容を以下に書き換えてください
```
DB_CONNECTION=pgsql
DB_HOST=postgresql
DB_PORT=5432
DB_DATABASE=ph4
DB_USERNAME=posse
DB_PASSWORD=password
```


<details><summary>.envの詳細</summary>
<p>

```shell
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=postgresql
DB_PORT=5432
DB_DATABASE=ph4
DB_USERNAME=posse
DB_PASSWORD=password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=cookie
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000

GOOGLE_DEVELOPER_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=


```


</p>
</details>


3. ビルドする
```
docker compose build --no-cache
```

4. コンテナを立ち上げる
```
docker compose up -d
```

5. 必要なパッケージをinstallする。まだ、Laravelのinstallができていないので、appコンテナに入って、Laravelのinstallを行います。
```
docker compose exec app sh
composer install
```
6. 以下のコマンドをappコンテナ内で実行、もしくは[localhost](http://localhost)でkey:generateを実行してください
(上記ですでにappコンテナに入っている場合、①行目は実行しなくて大丈夫です)
```
docker compose exec app sh
php artisan key:generate
```

7. [localhost](http://localhost) にアクセスし、Laravelのロゴ入りのトップページが表示されたら成功です！

# migrationの実行

1. migrationを実行する
```
php artisan migrate:fresh --seed
```
2. これが出てきたら成功です！
```shell
# php artisan migrate:fresh --seed

  Dropping all tables ........................................................................ 180ms DONE

   INFO  Preparing database.

  Creating migration table .................................................................... 47ms DONE

   INFO  Running migrations.

  2014_10_12_000000_create_users_table ....................................................... 154ms DONE
  2014_10_12_100000_create_password_reset_tokens_table ........................................ 55ms DONE
  2019_08_19_000000_create_failed_jobs_table .................................................. 82ms DONE
  2019_12_14_000001_create_personal_access_tokens_table ...................................... 112ms DONE
  2024_09_23_090341_create_posses_table ....................................................... 39ms DONE


   INFO  Seeding database.

  Database\Seeders\PosseTableSeeder ............................................................. RUNNING
  Database\Seeders\PosseTableSeeder .......................................................... 10 ms DONE
```

3.pgadminのログイン画面に遷移する
```
http://localhost:5050
```
メール: admin@example.com
パスワード: password

4."新しいサーバーを追加"
"一般"で"名前"に"postgresql"を入力

上のバーから"接続"を選択し、以下を入力。
```
•	ホスト名 / アドレス: postgresql
•	ポート: 5432
•	ユーザー名: posse
•	パスワード: password
```

5.保存を押して接続を試す

6.表示されたらpostgresql->データベース->Ph4->スキーマ->public->tablesを選択

7.usersを右クリックし、データを閲覧/編集をクリック

8.データが入っていれば成功です！

## フロント環境構築
1. frontのディレクトリに移動する
```
cd front
```

2. npm installを実行する
```
npm install
```

3. npm run devを実行する
```
npm run dev
```

4. [ここ](http://localhost:3000) にアクセスし、画面が出てきたら成功です！

## eslint と prettier のコマンド

```
npm run lint
npm run prettier
```

cd frontしてから実行してください。

## PHP-CS-Fixerのコマンド

以下のコマンドでコードスタイルを修正できるようになります。
```
composer cs-fix
```

また、コードスタイルのチェックだけを行いたい場合は、以下のコマンドを使用します。
```
composer cs-check
```

## アンケート配布処理
1.事前準備
envファイルの以下を追加
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME="harmonia.pomeranian@gmail.com"
MAIL_PASSWORD="jnlm bzzr bdqq ycza"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="harmonia.pomeranian@gmail.com"
MAIL_FROM_NAME="株式会社ポメラニアン"
```
ターミナルで

```
docker compose exec app sh
php artisan queue:table
php artisan migrate
```
2.メール送信したい時
```
Console/Kernel.phpの下部を、メールを送信したい時間に設定する
protected function schedule(Schedule $schedule)
    {
        // php artisan schedule:runで実行
        $schedule->command('survey:send')->everyMinute();
    }
```
ターミナルで
```
php artisan queue:work
```
または
```
php artisan schedule:run
```


