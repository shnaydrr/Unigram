<?php

$db_host = 'localhost';
$db_name = 'Unigram';
$db_user = 'root';
$db_password = 'Aspire[}.';

try {
    $unigram_conn = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_password);
    $unigram_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("connection failed:" . $e->getMessage());
}
