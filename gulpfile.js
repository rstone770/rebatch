const gulp = require('gulp'),
      path = require('path');

/**
 * Tasks to load.
 *
 * @type {string[]}
 */
const tasks = ['bundle', 'test', 'lint'];

/**
 * Converts a task name to a absolute path.
 *
 * @param {string} task
 * @returns {string}
 */
const taskToPath = (task) => path.join(__dirname, 'gulp', task);

tasks
  .map((task) => taskToPath(task))
  .forEach((file) => require(file)(gulp));
