export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            -> title: type String, recibido: ${product.title}
            -> description: type String, recibido: ${product.description}
            -> code: type String, recibido: ${product.code}
            -> price: type Number, recibido: ${product.price}
            -> stock: type Bigint, recibido: ${product.stock}
            -> category: type String, recibido: ${product.category}

    `;
};


export const generateProductErrorInfoENG = (product) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
        -> title: type String, recibido: ${product.title}
        -> description: type String, recibido: ${product.description}
        -> code: type String, recibido: ${product.code}
        -> price: type Number, recibido: ${product.price}
        -> stock: type Bigint, recibido: ${product.stock}
        -> category: type String, recibido: ${product.category}
    `;
};