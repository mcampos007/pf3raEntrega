function validateProduct(req, res, next) {
    
  const { title, description, code, price, status, stock, category } = req.body;
    const missingProperties = [];

    const checkProperty = (prop, propName, type) => {
        if (!prop) {
            missingProperties.push({ propertyName: propName, type: type });
        }
    };

    checkProperty(title, "title", "string");
    checkProperty(description, "description", "string");
    checkProperty(code, "code", "string");
    checkProperty(price, "price", "number");
    // checkProperty(status, "status", "boolean");
    checkProperty(stock, "stock", "bigint");
    checkProperty(category, "category", "string");

    if (missingProperties.length > 0) {
        return res.json({
            error: "Missing required properties",
            missingProperties: missingProperties,
        });
    }

    next();
  }
  
  export { validateProduct };