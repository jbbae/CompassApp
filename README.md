# SagePath
# Running the app

First, you'll need to set up a new Parse app at [Parse.com](https://parse.com).
This is where we'll store the remote data for your Todo list demo. Once you've
done this, insert your app's Application Id and JavaScript Key into the Parse
initialization call in [`app.js`](js/app.js).

To run the application, you must have [`npm`](https://www.npmjs.org/) installed.
Once that is in place, you can build the app by running the following commands
from the `todo/` directory.

```
npm install
npm start
```

The first line installs the necessary tools, and the second starts a watcher
process that compiles the application any time files are changed. If you don't
intend on modifying the files in any way, you can kill it after it has built
`bundle.js` with `Ctrl-C`.

Open the `index.html` file, and you should see an empty Todo list. Try adding,
editing, and deleting entries. If you open the network activity tab on your
browser, you can see the updates happening before the network requests complete.
