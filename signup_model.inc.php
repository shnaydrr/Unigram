<?php

function get_username(object $unigram_conn, $username)
{
    $query = "SELECT username FROM users WHERE username = :username;";
    $stmt = $unigram_conn->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function get_email(object $unigram_conn, $email)
{
    $query = "SELECT email FROM users WHERE email = :email;";
    $stmt = $unigram_conn->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function set_users(object $unigram_conn, $firstname, $lastname, $email, $password, $university)
{
    try{
        $query = "INSERT INTO users (firstname, lastname, email, `password`, university) VALUES (:firstname, :lastname, :email, :hashedpassword, :university);";
        $stmt = $unigram_conn->prepare($query);

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        $stmt->bindParam(":firstname", $firstname);
        $stmt->bindParam(":lastname", $lastname);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":hashedpassword", $hashedPassword);
        $stmt->bindParam(":university", $university);
        $stmt->execute();

        // $query = "SELECT * FROM users WHERE email = :email";
        // $selectstmt = $unigram_conn->prepare($query);
        // $selectstmt->bindParam(":email", $email);
        // $selectstmt->execute();

        // $result = $selectstmt->fetch(PDO::FETCH_ASSOC);
        // return $result;
    }catch (Exception $e){
        error_log("Error is set_user():".$e->getMessage(), 0);
        throw $e;
    }
}

function update_user(object $unigram_conn, $email, $username, $bio, $profile_pic_id)
{
    $query = "UPDATE users SET username = :username, bio = :bio, profile_pic_id = :profile_pic_id WHERE email = :email;";
    $stmt = $unigram_conn->prepare($query);


    $stmt->bindParam(":username", $username);
    $stmt->bindParam(":bio", $bio);
    $stmt->bindParam(":profile_pic_id", $profile_pic_id);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
}

function get_user(object $unigram_conn, $email)
{
    $query = "SELECT * FROM users WHERE email = :email";
    $selectstmt = $unigram_conn->prepare($query);
    $selectstmt->bindParam(":email", $email);
    $selectstmt->execute();

    $result = $selectstmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}


function update_profile(object $unigram_conn, $email, $profile_pic_id)
{
    $query = "UPDATE users SET profile_pic_id = :profile_pic_id WHERE email = :email;";
    $stmt = $unigram_conn->prepare($query);


    $stmt->bindParam(":profile_pic_id", $profile_pic_id);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
}

function update_username(object $unigram_conn, $email, $username)
{
    $query = "UPDATE users SET username = :username WHERE email = :email;";
    $stmt = $unigram_conn->prepare($query);


    $stmt->bindParam(":username", $username);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
}

function update_bio(object $unigram_conn, $email, $bio)
{
    $query = "UPDATE users SET bio = :bio WHERE email = :email;";
    $stmt = $unigram_conn->prepare($query);


    $stmt->bindParam(":bio", $bio);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
}
