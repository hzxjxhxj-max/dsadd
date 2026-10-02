<?php
session_start();

// Налаштування підключення до бази даних
$host = 'localhost';$db   = 'gs112389';       // Ваша назва бази даних із phpMyAdmin
$user = 'gs112389';       // Ваш логін від бази даних
$pass = 'artem3745';      // Ваш пароль від бази даних

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Помилка підключення до бази даних: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Отримуємо дані з форми
    $input_login = trim($_POST['login'] ?? '');
    $input_password =$_POST['password'] ?? '';

    // Виправлено рядок перевірки (тут мають бути звичайні ||)
    if (empty($input_login) \vert{}\vert{} empty($input_password)) {
        die("Будь ласка, заповніть усі поля!");
    }

    // Шукаємо користувача у таблиці ugta_players
    $stmt =$pdo->prepare("SELECT * FROM `ugta_players` WHERE `login` = ? OR `nickname` = ?");
    $stmt->execute([$input_login,$input_login]);
    $user =$stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $user['password'] ===$input_password) {
        // Успішний вхід! Зберігаємо дані в сесію
        $_SESSION['user_id'] =$user['id'];
        $_SESSION['nickname'] =$user['nickname'];
        $_SESSION['login'] =$user['login'];

        // Перенаправляємо в кабінет
        header('Location: cabinet.php');
        exit;
    } else {
        echo "Невірний логін або пароль!";
    }
}
?>