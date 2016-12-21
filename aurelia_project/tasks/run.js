import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import project from '../aurelia.json';
import build from './build';
import { CLIOptions } from 'aurelia-cli';
import cp from 'child_process';

function log(message) {
  console.log(message); //eslint-disable-line no-console
}

function onChange(path) {
  log(`File Changed: ${path}`);
}

let bSync = null;
function reload(done) {
  bSync.reload();
  done();
}

let count = 0;
let serve = gulp.series(
  build,
  done => {
    // Launch ASP.NET Core server after the initial bundling is complete
    if (++count === 1) {
      const options = {
        cwd: './server/',
        stdio: ['ignore', 'pipe', 'inherit'],
        env: Object.assign({}, process.env, {
          ASPNETCORE_ENVIRONMENT: 'Development',
        }),
      };
      cp.spawn('dotnet', ['watch', 'run'], options).stdout.on('data', data => {
        process.stdout.write(data);
        if (data.indexOf('Application started.') !== -1) {
          if (bSync == null) {
            bSync = browserSync.create();
            bSync.init({
              port: 9000,
              proxy: {
                target: "localhost:5000",
                middleware: function (req, res, next) {
                  console.log(req.url);
                  next();
                }
              }
            }, function (err, bs) {
              let urls = bs.options.get('urls').toJS();
              log(`Application Available At: ${urls.local}`);
              log(`BrowserSync Available At: ${urls.ui}`);
              done();
            });
          } else {
            bSync.reload();
          }
        }
      });
    }
  }
);

let refresh = gulp.series(
  build,
  reload
);

let watch = function () {
  gulp.watch(project.transpiler.source, refresh).on('change', onChange);
  gulp.watch(project.markupProcessor.source, refresh).on('change', onChange);
  gulp.watch(project.cssProcessor.source, refresh).on('change', onChange);
};

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    watch
  );
} else {
  run = serve;
}

export default run;
