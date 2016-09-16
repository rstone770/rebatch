import gulp from 'gulp';
import bundle from './gulp/bundle';
import lint from './gulp/lint';
import test from './gulp/test';

[bundle, lint, test].forEach((task) => task(gulp));
