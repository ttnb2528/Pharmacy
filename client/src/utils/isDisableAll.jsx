export const isDisableAll = (...props) => {
  return props.some((prop) => !prop);
};
