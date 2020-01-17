

exports.updater = () => {
  dialog.showMessageBox(
     {
       message: "Update is available",
       buttons: ["Default Button", "Cancel Button"],
       defaultId: 0, // bound to buttons array
       cancelId: 1 // bound to buttons array
     })
     .then(result => {
       if (result.response === 0) {
         // bound to buttons array
         console.log("default btn press");
       }
     }
   );
}
