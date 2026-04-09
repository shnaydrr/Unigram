<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

set_exception_handler(function($e) {
    error_log("CONVO HANDLER Exception: " . $e->getMessage() . " in " . $e->getFile() . " line " . $e->getLine());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage(), 'line' => $e->getLine()]);
});

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("CONVO HANDLER Error [$errno]: $errstr in $errfile line $errline");
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

require_once "dbconnection.inc.php";
require_once "sessionconfig.inc.php";
require_once "convo_model.inc.php";

error_log("SESSION DATA: " . print_r($_SESSION, true));

if (!isset($_SESSION["userid"])) {
    http_response_code(401);
    echo json_encode(['error' => 'Session missing userid']);
    exit();
}

$currentLogedInUserId = $_SESSION["userid"];


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));
    $convoPackage = $data->convoPackage;

    if ($convoPackage === 'initial_load') {
        $allUserFriendsId = get_allFriendsId($unigram_conn, $currentLogedInUserId);
        $allUserFriendsData = get_alluserfriendsdata($unigram_conn, $allUserFriendsId);

        $currentLoggedUserConvoIds = get_allConvoIdOfOneUser($unigram_conn, $currentLogedInUserId);

        $response = array(
            'allUserFriendsData' => $allUserFriendsData,
            'currentLoggedUserConvoIds' => $currentLoggedUserConvoIds,
            'currentLogedInUserId' => $currentLogedInUserId
        );

        echo json_encode($response);
        http_response_code(203);
    } else if (doesConvoExistForCurrentUser($unigram_conn, $currentLogedInUserId, $convoPackage)) {

        $convoId = get_convoid($unigram_conn, $currentLogedInUserId, $convoPackage);

        echo json_encode($convoId);
        http_response_code(201);
    } else if (doesConvoExistForBothUser($unigram_conn, $currentLogedInUserId, $convoPackage)) {
        $convoId = get_convoid($unigram_conn, $currentLogedInUserId, $convoPackage);
        $userOneFriendData = get_useronefrienddata($unigram_conn, $convoPackage);

        $response = array(
            'userOneFriendData' => $userOneFriendData,
            'convoId' => $convoId,
            'currentLogedInUserId' => $currentLogedInUserId
        );

        echo json_encode($response);
        http_response_code(202);
    } else {
        add_convo($unigram_conn, $currentLogedInUserId, $convoPackage);

        $userOneFriendData = get_useronefrienddata($unigram_conn, $convoPackage);

        $convoId = get_convoid($unigram_conn, $currentLogedInUserId, $convoPackage);
        $allConvoData = get_convodata($unigram_conn, $convoId["convor_id"]);

        $lastConvoRowData = end($allConvoData);

        $response = array(
            'userOneFriendData' => $userOneFriendData,
            'convoId' => $convoId,
            'currentLogedInUserId' => $currentLogedInUserId
        );
        echo json_encode($response);
        http_response_code(200);
    }
}
