

// setTimeout(function() {
//   update();
// }, 3000);

// setTimeout(function() {
//   autoUpdater.autoDownload = false
//   autoUpdater.on('update-available', () => {
//     dialog.showMessageBox(
//        {
//          message: "Update is available",
//          buttons: ["Default Button", "Cancel Button"],
//          defaultId: 0, // bound to buttons array
//          cancelId: 1 // bound to buttons array
//        })
//        .then(result => {
//          if (result.response === 0) {
//            // bound to buttons array
//            autoUpdater.downloadUpdate();
//          }
//        }
//      );
//   });
//   autoUpdater.on('update-downloaded', () => {
//     dialog.showMessageBox(
//        {
//          message: "Do you want to download now?",
//          buttons: ["Yes", "Later"],
//          defaultId: 0, // bound to buttons array
//          cancelId: 1 // bound to buttons array
//        })
//       .then(result => {
//         if (result.response === 0) {
//           // bound to buttons array
//           autoUpdater.quitAndInstall(false, true);
//         }
//       }
//     );
//   });
// }, 3000);
//
