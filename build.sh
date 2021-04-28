#make
npx babel ./src --presets=@babel/preset-typescript,@babel/preset-env  --plugins=@babel/plugin-transform-runtime,@babel/plugin-proposal-class-properties    --copy-files --extensions ".ts" --out-dir dist 
npx node-sass -r ./scss/*.scss  -o ./build-css/
mv dist/main.js .
npx webpack --entry=./dist --output-path=./build-src --output-filename=index.js --target=electron-renderer
# build
npx electron-builder