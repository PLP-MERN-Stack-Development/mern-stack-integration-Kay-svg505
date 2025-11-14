// server/utils/apiResponse.js
export const success = (res, data, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const fail = (res, message = "Failed", status = 400) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
