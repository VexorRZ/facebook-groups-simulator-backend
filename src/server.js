import io from './app';

const port = 3333;
io.listen(port, () => {
  console.log(`Server listening the port ${port}.`);
});
