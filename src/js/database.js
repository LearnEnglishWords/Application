function writeFile(fileEntry, dataObj, callback) {
  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntry.createWriter(function (fileWriter) {
    fileWriter.onwriteend = function() {
      callback();
    };
    fileWriter.onerror = function (e) {
        console.log("Failed file write: " + e.toString());
    };
    // If data object is not passed in,
    // create a new Blob instead.
    if (!dataObj) {
        dataObj = new Blob(['some file data'], { type: 'text/plain' });
    }
    fileWriter.write(dataObj);
  });
}

function readFile(fileEntry, callback) {
  fileEntry.file(function (file) {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(this.result);
    };
    reader.readAsText(file);
  });
}





export default class Database {
  constructor() { 
    //this.write("my.csv", "name;surname;age\nmartin;jablecnik;26\ntomas;vopolka;23", () => {
    //});
  }

  directory(path, success, error) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
      fileSystem.root.getDirectory(path, { create: true });
    }, () => console.log(evt.target.error.code)); 
  }

  exists(path, success, error) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
      fileSystem.root.getFile(path, { create: false }, success, error);
    }, () => console.log(evt.target.error.code)); 
  }

  read(file, callback) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile(file, { create: true, exclusive: false }, 
        function (fileEntry) {
          readFile(fileEntry, callback);
      });
    });
  }

  write(file, data, callback) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile(file, { create: true, exclusive: false }, 
        function (fileEntry) {
          writeFile(fileEntry, data, callback);
      });
    });
  }

  list_dir(directory_path) {
    window.resolveLocalFileSystemURL(directory_path , function(dirEntry) {
        var directoryReader = dirEntry.createReader();
        //console.log(dirEntry);

        // Get a list of all the entries in the directory
        directoryReader.readEntries(
          (entries) => {
            var i;
            for (i=0; i<entries.length; i++) {
              alert(JSON.stringify(entries[i], null, 2));
              //alert('En - ' + entries[i]);
            }
          },
          () => alert("Failed to list directory contents: " + error)
        );
    });
  }
}
