export const validateUrl = (url: string) => {
  const regex = /^(http|https):\/\/[^ "]+$/;
  return regex.test(url);
};
