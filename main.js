// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


app.get('/pesan', function (req, res) {
  Message.find({}, function (err, pesan) {
    res.send(pesan);
  });
})

app.post('/pesan',async function (req, res) {
  var message = new Message(req.body);

  var savedMessage = await message.save() //untuk menghandle data besar, supaya antri
  // sekarang anonymous functionya di dalam then
  console.log('Tersimpan');
  var sensor = await Message.findOne({pesan: 'badword'})
  if (sensor) {
    await Message.deleteMany({_id: sensor.id});
  } else {
    io.emit('pesan', req.body);
  }
  res.sendStatus(200);

  //     .catch((err)=>{
  //     res.sendStatus(500);
  //     return console(err);
  // })
})



io.on('connection', function (socket) {
  console.log('a user connected !');
})

mongoose.connect(dbUrl,function (err) {
  console.log('berhasil connect ke mlab', err);
})

var server = http.listen(3000, function () {
  console.log("port server adalah ",server.address().port)
});