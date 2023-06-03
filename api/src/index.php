<?php
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: text/html; charset=utf-8');

  require_once('./mysql.php');

  if (isset($_GET['pushBot']) && $_POST['id'] && $_POST['name'] && $_POST['email'] && $_POST['token']) {
    try {
      $rq_insert = $pdo->prepare('INSERT INTO kingpet_bots (id, name, email, token) VALUES (?, ?, ?, ?)');
      $rq_insert->execute([
        $_POST['id'],
        $_POST['name'],
        $_POST['email'],
        $_POST['token'],
      ]);

      $rq_getnbr = $pdo->prepare('SELECT COUNT(id) FROM kingpet_bots');
      $rq_getnbr->execute();
      $nbr = $rq_getnbr->fetch(PDO::FETCH_COLUMN);

      echo "Bot added ! Now there are $nbr bots !";
    } catch (Exception $ex) {
      $rq_update = $pdo->prepare('UPDATE kingpet_bots SET token = ? WHERE email = ?');
      $rq_update->execute([
        $_POST['token'],
        $_POST['email'],
      ]);

      echo 'Bot token updated !';
    }
  }

  if (isset($_GET['getBots'])) {
    $rq_get = $pdo->prepare('SELECT * FROM kingpet_bots ORDER BY RAND() LIMIT 1000');
    $rq_get->execute();
    $bots = $rq_get->fetchAll(PDO::FETCH_ASSOC | PDO::FETCH_UNIQUE);
    echo json_encode([ success => true, bots => $bots ]);
  }

  if (isset($_GET['getPets'])) {
    $rq_get = $pdo->prepare('SELECT * FROM kingpet_pets ORDER BY name DESC');
    $rq_get->execute();
    $pets = $rq_get->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([ success => true, pets => $pets ]);
  }
?>
