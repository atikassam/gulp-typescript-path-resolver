import * as through from 'through2';

import { replacePath } from './replace-path';

export function tsPathResolver(importOptions: any, overwriteOptions: any) {
    overwriteOptions = overwriteOptions || {};
    importOptions.paths = importOptions.paths || {};
    overwriteOptions.paths = overwriteOptions.paths || {};
	Object.assign(importOptions.paths, overwriteOptions.paths);

	return through.obj(function(file, enc, cb) {
		let code = file.contents.toString('utf8');
		
		code = replacePath(code, file.history.toString(), importOptions.outDir, importOptions.paths);
		
		file.contents = new Buffer(code);
		this.push(file);
    	cb();
	});
}