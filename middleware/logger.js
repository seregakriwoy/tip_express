const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const queryParams = JSON.stringify(req.query);
  const bodyParams = JSON.stringify(req.body);
  
  console.log(`[${timestamp}] ${method} ${url}`);
  console.log(`Query: ${queryParams}`);
  console.log(`Body: ${bodyParams}`);
  console.log('---');
  
  next();
};

module.exports = logger;