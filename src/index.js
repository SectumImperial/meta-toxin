import './index.scss';

const cache = {};

function importAll(r) {
  r.keys().forEach((key) => {
    const newKey = key;
    cache[newKey] = r(newKey);
  });
}

importAll(require.context('../src/', true, /\.js$/));
