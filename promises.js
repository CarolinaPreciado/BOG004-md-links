const { resolve } = require('path');
const path = require('path');
const fs = require('fs');

const userPath = process.argv[2];

const pathValidation = (route) => {
    const newRoute = path.resolve(route).normalize();
if(!path.isAbsolute(userPath)){
    console.log('La ruta se transformo en absoluta', newRoute);
    return newRoute;
} else{
    console.log('La ruta es absoluta', userPath)
    return userPath;
}
}
pathValidation(userPath);
