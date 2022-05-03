const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
const mdLinkExtractor = require('markdown-link-extractor');
const linkCheck = require('link-check');


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

const identifyFile = (userPath) => {
    if(path.extname(pathValidation(userPath))==='.md'){
        console.log('Es un archivo .md');
    }else{
    console.log('No se encontro un archivo .md, por favor intenta con otra ruta')
    }
}
identifyFile(userPath);

const readNewFile = (userPath) => {
    return new Promise ((resolve, reject) => {
fs.readFile(userPath, 'UTF-8', (error, file) => {
    if(error){
        reject(error);
        throw error;
    }
    // console.log(mdLinkExtractor(file))
    const { links } = mdLinkExtractor(file);
    // links.forEach(link => console.log(link));

//     links.forEach(link => 
//         linkCheck(link, function (err, result) {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//             console.log(JSON.stringify(result, null, 4));
//             // console.log(result.statusCode);

//         })
// );
    //luego ya no estará el console.log si no allí debe ir nuestra función de validar los links

    resolve(file);
    // resolve({content:file, path:userPath});
    // console.log(resolve({content:file, path:userPath}));
});
console.log('Este es el contenido del archivo....');
    })
    }
    readNewFile(userPath).then(()=> {
        console.log('Se esta leyendo la funcion')
    });

    // C:\Users\57318\Development\Laboratoria\BOG004-md-links\testFile.md

