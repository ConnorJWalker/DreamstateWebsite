/**
 * This file is used to copy the contents of all of the JS files into
 * one file, this is not part of the website. Babel could have been used
 * for this but it was confusing so yolo
 */

const fs = require('fs');

// Read javascript files
(function() {
    let files = fs.readdirSync('js/')
    files = files.filter(file => file.split('.')[1] === 'js')
    
    let contents = []
    let finalFile
    
    files.forEach(file => {
        if (file !== 'script.js')
            contents.push(`/*--- ${file} ---*/\n` + fs.readFileSync('js/' + file, 'utf8'))
        else
            finalFile = fs.readFileSync('js/' + file, 'utf8')
    })
    
    contents.push(finalFile)
    createNewFile(contents, 'js')
}());

// Read css files
// (function() {
//     let files = fs.readdirSync('css/')
    
//     let contents = []
    
//     files.forEach(file => {
//         if (file !== 'master.css')
//             contents.push(`/*--- ${file} ---*/\n` + fs.readFileSync('css/' + file, 'utf8'))
//         else
//             contents.unshift(`/*--- ${file} ---*/\n` + fs.readFileSync('css/' + file, 'utf8'))
//     })
    
//     createNewFile(contents, 'css')
// }());


/**
 * creates a new file with all of the other files merged together
 * @param {string[]} files the contents of each file to be added
 * @param {string} type the type of file (js/css) being created
 */
function createNewFile(files, type) {
    let fileData = ''
    files.forEach(file => fileData += file + '\n')

    const dir = type === 'js' ? 'js/script.bundle.js' : 'css/styles.bundle.css'
    fs.unlink(dir, err => {
        if (err && err.errno !== -4058) {
            console.error(err)
        } else {
            console.info('Writing to file: ' + dir)
            fs.writeFileSync(dir, fileData + '\n', 'utf8')
        }
    })
}