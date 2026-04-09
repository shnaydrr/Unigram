<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = $_POST["us"];
    $bio = $_POST["bio"];
    // Capture Username and Bio

    // Capture file detailes
    $file = $_FILES["file"];
    $fileName = $_FILES["file"]["name"];
    $fileTmpName = $_FILES["file"]["tmp_name"];
    $fileSize = $_FILES["file"]["size"];
    $fileError = $_FILES["file"]["error"];
    $fileType = $_FILES["file"]["type"];

    // Process file to get Extansion
    $fileExt = explode('.', $fileName);
    $fileActualExt = strtolower(end($fileExt));

    $extAllowed = array('jpg', 'png', 'jpeg',);


    try {

        require_once "sessionconfig.inc.php";
        // require_once "dbconnection.inc.php";
        require_once "signup_model.inc.php";
        require_once "signup_control.inc.php";


        // ERROR HANDLING
        $makosa = [];
        if (is_username_taken($unigram_conn, $username)) {
            $makosa["username_taken"] = "The username you choose is already taken";
        } else if (!in_array($fileActualExt, $extAllowed)) {
            $makosa["unsuportedformat"] = "Upload an image with format of either jpg, jpeg, png";
        } else if ($fileError > 0) {
            $makosa["unknownerror"] = "There was an error on uploading your file";
        } else if ($fileSize > 500000) {
            $makosa["bigsize"] = "Your image size is too big";
        } else if (in_array($fileActualExt, $extAllowed) && !is_username_taken($unigram_conn, $username) && $fileError === 0 && $fileSize < 500000) {
            $newFileName = uniqid("", true) . "." . $fileActualExt;
            $fileDestination = 'assets/UserPics/' . $newFileName;
            $_SESSION["fileDestination"] = $fileDestination;
            move_uploaded_file($fileTmpName, $fileDestination);
            echo $_SESSION["fileDestination"];
            echo $_SESSION["useremail"];
            $email = $_SESSION["useremail"];

            if ($email) {
                // $email = $_SESSION["useremail"];
                $profile_pic_id = $_SESSION["fileDestination"];

                update_user($unigram_conn, $email, $username, $bio, $profile_pic_id);

                $_SESSION["userbio"] = $bio;

                http_response_code(200);
                echo json_encode($success = "You have succeed in registering now use your credentials to login");
            } else {
                $makosa["uploadfailed"] = "why are you passing around";
            }
        }




        if ($makosa) {
            $_SESSION["makosa"] = $makosa;
            if ($_SESSION["makosa"]) {
                http_response_code(400);
                echo json_encode($makosa);
            }
            exit();
        }

        unset($_SESSION["makosa"]);
        $unigram_conn = null;
        $stmt = null;
        exit();
    } catch (PDOException $e) {
        die("connection error:" . $e->getMessage());
    };
} else {
    header("location: signup.php");
    die();
}
