// node modules
import readline from 'readline';
import chalk from 'chalk';
import opn from 'opn';
// our modules
import {api} from '../../utils';
import env from './assignConfig';

const exit = () => {
  /* eslint-disable eqeqeq */
  if (env.key == '\u001b') { // The ESCAPE key
    // Suspend on ESC and refresh the submission_request rather than deleting it.
    api({task: 'refresh', id: env.submission_request.id});
    console.log(chalk.green('Exited without deleting the submission_request...'));
    console.log(chalk.green('The current submission_request will expire in an hour.'));
    process.exit(0);
  } else if (env.key == '\u0003') { // The CTRL-C key
    // Delete submission_request object and exit on CTRL-C
    api({task: 'refresh', id: env.submission_request.id}).then(() => {
      console.log(chalk.green('Successfully deleted request and exited..'));
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

const open = () => {
  const baseReviewURL = 'https://review.udacity.com/#!/submissions/';
  if (env.key === '0') opn(`${baseReviewURL}dashboard`);
  if (env.key === '1' && env.assigned[0]) opn(`${baseReviewURL}${env.assigned[0].id}`);
  if (env.key === '2' && env.assigned[1]) opn(`${baseReviewURL}${env.assigned[1].id}`);
};

export default function handleKeypress() {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on('keypress', (str, key) => {
    /* eslint-disable eqeqeq */
    env.key = key.sequence;
    if (env.key == '\u001b' || env.key == '\u0003') {
      exit();
    } else if (['0', '1', '2'].includes(env.key)) {
      open(parseInt(env.key, 10), env.assigned);
    }
  });
}
