const untildify = require('untildify');
const electron = require('electron');

let workingDirectoryOverride;

if (
  electron.remote &&
  electron.remote.process &&
  Array.isArray(electron.remote.process.argv)
) {
  workingDirectoryOverride = electron.remote.process.argv[1];
} else if (
  process &&
  Array.isArray(process.argv)
) {
  workingDirectoryOverride = process.argv[1];
}

const pull = value => {
  if (workingDirectoryOverride) return untildify(workingDirectoryOverride);
  return value ? untildify(value) : process.env.HOME;
};

const push = cwd => store.dispatch({ type: 'SESSION_SET_CWD', cwd });

exports.middleware = store => next => action => {
  const {
    type,
    config: {
      workingDirectory,
    } = {},
  } = action;

  if (type === 'CONFIG_LOAD' || type === 'CONFIG_RELOAD') {
    push(pull(workingDirectory));
  }

  next(action);
};
