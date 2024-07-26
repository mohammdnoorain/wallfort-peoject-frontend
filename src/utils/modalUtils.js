export const openDialog = (dialogRef) => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    //  console.log( dialogRef.current.showModal());
    }
  };

export const closeDialog = (dialogRef) => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };


