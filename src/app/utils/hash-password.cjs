const bcrypt = require('bcrypt');

(async () => {
  const plain = '1234david';
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(plain, saltRounds);
    console.log('Hash generado:', hash);
  } catch (err) {
    console.error('Error generando hash:', err);
  }
})();