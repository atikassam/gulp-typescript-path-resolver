import * as path from 'path';

export function replacePath(code, filePath, rootPath, targetPaths) {
	let tscpaths = Object.keys(targetPaths);
	let lines = code.split("\n");

	return lines.map((line) => {
		let matches = [];
		let require_matches = line.match(/require\(('|")(.*)('|")\)/g);
		
		Array.prototype.push.apply(matches, require_matches);

		if(!matches) return line;

		// Walk through every require
		for(let match of matches) {

			// Find each paths
			for(let tscpath of tscpaths) {

				// Find required module & check if its path matching what is described in the paths config.
				let required_modules = match.match(new RegExp(tscpath, "g"));

				if(required_modules && required_modules.length > 0) {

					for(let required_module of required_modules) {

						// Get relative path and replace
						let sourcePath = path.dirname(filePath),
							targetPath;

                        // module/* --- file/*
						if (tscpath[tscpath.length - 1] === '*') {
							targetPath = path.resolve(rootPath + "/" + targetPaths[tscpath].map(_p => _p.replace('/*', '')));
							line = line.replace(new RegExp(tscpath.slice(0, -2), "g"), './'+path.relative(sourcePath, targetPath));
                        }

                        // module -- file
                        else {
                            targetPath = path.resolve(rootPath + "/" + targetPaths[tscpath]);
                            line = line.replace(new RegExp(tscpath, "g"), "./" + path.relative(sourcePath, targetPath));
						}
					}
				}
			}
			
		}

		return line;
	}).join("\n");
}