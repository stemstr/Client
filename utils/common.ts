export const noop = () => {};

export const chunkArray = (array: any[], chunkSize: number) => {
  const chunkedArray = [];
  const length = array.length;

  for (let i = 0; i < length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunkedArray.push(chunk);
  }

  return chunkedArray;
};
