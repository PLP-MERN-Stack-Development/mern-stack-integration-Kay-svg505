// server/utils/logger.js
export const log = (...args) => {
  console.log("[LOG]", ...args);
};

export const errorLog = (...args) => {
  console.error("[ERROR]", ...args);
};
