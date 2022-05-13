const linkCheck = jest.fn((link, cb) => {
  const result = {
    statusCode: 200,
    status: "alive",
  };
  const err = null;
  cb(err, result);
});

module.exports = linkCheck;
