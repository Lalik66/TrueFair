const bcrypt = require('bcryptjs');

const password = 'your_admin_password'; // Замените на желаемый пароль
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Ошибка при хешировании пароля:', err);
    return;
  }
  console.log('Хешированный пароль для MongoDB:');
  console.log(hash);
}); 