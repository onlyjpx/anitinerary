<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$username_db = "root";
$password_db = "";
$database = "banco";

$conn = new mysqli($host, $username_db, $password_db, $database);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Conexão Falhou: ' . $conn->connect_error]);
    exit();
}

session_start();
if (!isset($_SESSION)) {
    die(json_encode(['status' => 'error', 'message' => 'Sessão não foi iniciada corretamente']));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($data['email'], $data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    $sql = "SELECT * FROM usuarios WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        file_put_contents("debug.log", print_r($user, true));

        if (password_verify($password, $user['senha'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];

            $token = bin2hex(random_bytes(16)); // Gera um token aleatório
            $_SESSION['token'] = $token;

            echo json_encode([
                'status' => 'success',
                'message' => 'Login efetuado com sucesso!',
                'token' => $token, 
                'user_id' => $user['id']
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Senha incorreta!']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuário não encontrado!']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Requisição inválida']);
}

$conn->close();
?>
