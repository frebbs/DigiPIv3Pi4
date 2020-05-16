const workingDirRoot = __dirname + '/workingPiDir/';
const workingDirUploads = __dirname + '/workingPiDir/uploads';
const workingDirCurrentlyPlaying = __dirname + '/workingPiDir/playing';

const fs = require('fs');

// bring in Chokidar
const chokidar = require('chokidar');

const uploadWatcher = chokidar.watch(workingDirUploads, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

const playingNowWatcher = chokidar.watch(workingDirCurrentlyPlaying, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
})

//   uploadWatcher.on('created', (path) => {
//     console.log(`A file was changed: ${path}`);
//   })

// Checks the directory for changes and takes the approprite action

uploadWatcher.on('raw', (event, path, details) => {
    if (event == 'created' || event == 'modifed' ) {

        let filenamePath = path.split('/');
        let fileName = filenamePath[filenamePath.length - 1]
        let newFilePath = workingDirCurrentlyPlaying + '/' + fileName;

        // Move the uploaded file to the playing now directory (This deletes it from the updloads)
        fs.rename(path, newFilePath, (err) => {
            if (err) console.log(err)
            console.log('File deleted and moved')
        })
    }
})

// Checks the directory for changes and takes the approprite action

playingNowWatcher.on('raw', (event, path, detais) => {
    let filenamePath = path.split('/');
    let fileName = filenamePath[filenamePath.length - 1]

    // This is where I will tell the pi what to do with the new file
    if (event == 'moved') {
        console.log(`A file as been moved or updated: ${fileName}`)
    }
})