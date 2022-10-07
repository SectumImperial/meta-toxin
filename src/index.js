import './common/styles.scss';

const cache = {};

function importAll(r) {
  // eslint-disable-next-line no-return-assign
  r.keys().forEach((key) => (cache[key] = r(key)));
}

importAll(require.context('../src/', true, /\.js$/));
