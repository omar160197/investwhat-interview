export const ApiResponse = (res, statusCode, message, data = null) => {
  const body = { success: statusCode < 400, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};
