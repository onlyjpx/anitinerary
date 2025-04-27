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
    echo json_encode(['status' => 'error', 'message' => 'Conexão falhou: ' . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents("debug.log", print_r($data, true));

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($data['nome'], $data['email'], $data['password'])) {
    $nome = $conn->real_escape_string($data['nome']);
    $email = $conn->real_escape_string($data['email']);
    $senha = password_hash($data['password'], PASSWORD_DEFAULT); 

    $sql_check = "SELECT id FROM usuarios WHERE email = '$email'";
    $result_check = $conn->query($sql_check);

    if ($result_check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'E-mail já cadastrado!']);
    } else {
        $sql_insert = "INSERT INTO usuarios (nome, email, senha) VALUES ('$nome', '$email', '$senha')";
        
        if ($conn->query($sql_insert) === TRUE) {
            echo json_encode(['status' => 'success', 'message' => 'Usuário cadastrado com sucesso!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao cadastrar usuário: ' . $conn->error]);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Requisição inválida']);
}

$conn->close();
?>
