ionic-pouchdb-todo
==========================

A simple Ionic Todo app with a PouchDb local storage backend configured to sync
with a CouchDb installation. Demo of offline functionality with server synchronization.

You can watch me demo building the app at [FITC Spotlight: AngularJS](http://youtu.be/6ecuA-pOev0?t=14m9s) in Toronto.

This repository has multiple releases you can download or tags you can checkout to see the incremental building of the application.

## Installation

I've included the most current version of Ionic (1.0.0-beta.6) and
PouchDb (2.2.3) as of this check-in. This will enable running locally 
the app in a browser without needing `node` to install `cordova`, `ionic`, or `gulp` 

## Run the App

All of the necessary javascript files are in the repo for simplicities sake. 
You can `cd` into the `www` directory and run 

```bash
python -m SimpleHTTPServer 8000
```

You can then just open [http://localhost:8000/index.html](http://localhost:8000/index.html) in a browser.

Personally I use WebStorm which has a built in server. From a JetBrains product, you can select "View...", "Open in Browser" on index.html.

The final version of this demo requires you to [download and install CouchDb](http://couchdb.apache.org/#download), which runs on port 5984. And, [enable CORS](http://docs.couchdb.org/en/1.6.1/config/http.html#cross-origin-resource-sharing).

## iOS version

However, to run this as a mobile application in iOS emulator,
do the following to setup : 

```bash
$ cd ionic-pouchdb-todo
$ sudo npm install -g cordova ionic gulp
```

To run in the iPhone Simulator:

```bash
ionic platform add ios
ionic build ios
ionic emulate ios
```

## Building Out & Updating Ionic or PouchDb

To continue working on this repository, adding tests, using SASS, you can

```bash
$ npm install
$ gulp install
```

To update to a new version of Ionic, open bower.json and change the version listed there.

For example, to update from version `1.0.0-beta.6` to `1.0.0-beta.7`, open bower.json and change this:

```
"ionic": "driftyco/ionic-bower#1.0.0-beta.6"
```

To this:

```
"ionic": "driftyco/ionic-bower#1.0.0-beta.7"
```

After saving the update to bower.json file, run `gulp install`.

Alternatively, install bower globally with `npm install -g bower` and run `bower install`.
