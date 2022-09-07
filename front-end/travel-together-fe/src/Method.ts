export const dateSortDesc = (array: any[], dateType: string) => {
  if (array.length > 0) {
    array.sort(
      (a: any, b: any) =>
        Number(new Date(b[dateType])) - Number(new Date(a[dateType]))
    );
  }
  return array;
};
