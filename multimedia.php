<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $receiverId = $_POST["receiverId"];
    $senderId = $_POST["senderId"];
    $convorId = $_POST["convorId"];
    $multimedia_status = 1;


    $photo = $_FILES["photo"];
    $photoName = $_FILES["photo"]["name"];
    $photoTmpName = $_FILES["photo"]["tmp_name"];
    $photoSize = $_FILES["photo"]["size"];
    $photoError = $_FILES["photo"]["error"];
    $photoType = $_FILES["photo"]["type"];

    $photoExt = explode('.', $photoName);
    $photoActualExt = strtolower(end($photoExt));

    $extAllowed = array('jpg', 'png', 'jpeg',);


    try {
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

        require_once "chatmessage_model.inc.php";



        if (!in_array($photoActualExt, $extAllowed)) {
            $makosa["unsuportedformat"] = "Upload an image with format of either jpg, jpeg, png";
        } else if ($photoError > 0) {
            $makosa["unknownerror"] = "There was an error on uploading your file";
        } else if ($photoSize > 500000) {
            $makosa["bigsize"] = "Your image size is too big";
        } else if (in_array($photoActualExt, $extAllowed) && $photoError === 0 && $photoSize < 50000000) {
            $newphotoName = uniqid("", true) . "." . $photoActualExt;
            $photoDestination = 'assets/MultimediaFiles/Photos/' . $newphotoName;
            $_SESSION["fileDestination"] = $photoDestination;
            move_uploaded_file($photoTmpName, $photoDestination);



            $imagepackage = new stdClass();

            $imagepackage->photoDestination = $photoDestination;
            $imagepackage->receiverId = $receiverId;
            $imagepackage->senderId = $senderId;
            $imagepackage->convorId = $convorId;
            $imagepackage->multimedia_status = $multimedia_status;

            $lastPhoto = add_photofile($unigram_conn, $imagepackage);

            // error_log(json_encode($imagepackage) . "\n", 3, "debug.log");
            // error_log(json_encode($lastPhoto) . "\n", 3, "debug.log");

            echo json_encode($lastPhoto);
            http_response_code(201);
        }
    } catch (PDOException $e) {
        error_log("Error: " . $e->getMessage() . "\n", 3, "debug.log");
    }
} else {
    header("location: chat.php");
    die();
}










    // $extAllowed = array('pdf', 'docx', 'xlsx', 'xls', 'csv', 'pptx', 'txt');
