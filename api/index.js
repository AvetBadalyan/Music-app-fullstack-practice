/**
 * Vercel serverless entry point.
 *
 * Vercel treats every file under `api/` as a function and invokes the export
 * with (req, res) - an Express app is already that shape, so the whole API
 * runs as a single function with `vercel.json` rewriting all paths here.
 * The app never calls `listen()`; the platform owns the socket.
 *
 * This file is plain JavaScript, and it requires the compiled output rather
 * than `src/` on purpose. Vercel compiles TypeScript with esbuild, which does
 * not implement `emitDecoratorMetadata` - and the TypeORM entities infer their
 * column types from it (`@Column() title!: string`), so an esbuild-compiled
 * entity throws ColumnTypeUndefinedError the moment the class is defined.
 * `npm run build` runs tsc, which does emit that metadata, so the build step
 * produces `dist/` and this entry point loads it.
 */

// `.default` because src/app.ts uses `export default`, which tsc compiles to
// `exports.default` - without it Vercel receives an object, not a handler.
module.exports = require('../dist/app.js').default;
