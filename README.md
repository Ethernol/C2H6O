# C2H6O

## Start mongodb

First install and then start MongoDB. Then create the database with the following collections.

```
use EthernolDB
db.createCollection("users");
db.createCollection("translations");
db.createCollection("images");
db.createCollection("address");

db.users.createIndex({ address_id: 1 }, { unique: true })
db.addresses.createIndex({ address: 1 }, { unique: true })
```

## Start the server

```
cd backend
deno run -A --watch server.ts
```

## Start the frontend

```
cd backend
npm install
npm audit fix --force
```
There should be 6 moderate vulnerabilities otherwise run `npm audit fix --force` again.
For testing, run
```
npm run dev -- --open
```

## Using the application

The following screen shots show how to create a new link to a creator image.
Fans can paint on it and share their love for the creator by donating money to the creator!




## Problems when testing

Browsers can pose quite a lot of problems when testing the workability of the server combined with accessing a database on the same machine.
This means that actions like `POST` and `GET` can be disallowed.
To run the Browser in a testing environment in the case of Brave and MacOS you should run
```
open -n -a /Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser --args --user-data-dir="/tmp/chrome_dev_test"
```
Maybe the additional flag `--disable-web-security` is necessary.
Note that this also poses another difficulty as registering in Metamask does not work quite well.

In general final testing could not be accomplished as the server has to be pushed to production.
And the database as well.

