<?php
session_start();

// Якщо гравець не увійшов — відправляємо назад на сторінку входу
if (!isset($_SESSION['user_id'])) {
    header('Location: cabinet.html');
    exit;
}

$host = 'localhost';$db   = 'gs112389';
$user = 'gs112389';$pass = 'artem3745';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Отримуємо актуальні дані персонажа з бази
    $stmt =$pdo->prepare("SELECT * FROM `ugta_players` WHERE `id` = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $player =$stmt->fetch(PDO::FETCH_ASSOC);

    if (!$player) {
        session_destroy();
        header('Location: cabinet.html');
        exit;
    }
} catch (PDOException $e) {
    die("Помилка бази даних: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Особистий кабінет — <?php echo htmlspecialchars($player['nickname']); ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body style="background: #0f1015; color: #fff; font-family: 'Inter', sans-serif; padding: 40px;">

    <div class="container" style="max-width: 900px; margin: 0 auto;">
        <!-- Верхня панель профілю -->
        <div style="background: rgba(25, 26, 35, 0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="margin: 0; font-size: 1.8rem; color: #fbbf24;"><?php echo htmlspecialchars($player['nickname']); ?> <span style="font-size: 1rem; color: #888;">(ID: #<?php echo $player['id']; ?>)</span></h1>
                <p style="margin: 5px 0 0; color: #4ade80;"><i class="fa-solid fa-circle" style="font-size: 0.6rem;"></i> Акаунт активовано</p>
            </div>
            <a href="logout.php" style="background: #ef4444; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">Вийти</a>
        </div>

        <!-- Статистика гравця -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 30px;">
            <div style="background: rgba(25, 26, 35, 0.9); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0; color: #888; font-size: 0.9rem;">Ігровий рівень</p>
                <h2 style="margin: 10px 0 0; font-size: 2.2rem;"><?php echo $player['level']; ?></h2>
                <small style="color: #aaa;">Досвід (EXP): <?php echo $player['exp']; ?></small>
            </div>

            <div style="background: rgba(25, 26, 35, 0.9); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0; color: #888; font-size: 0.9rem;">Логін / Пошта</p>
                <h3 style="margin: 10px 0 0; font-size: 1.2rem; word-break: break-all;"><?php echo htmlspecialchars($player['login']); ?></h3>
            </div>
        </div>
    </div>

</body>
</html>